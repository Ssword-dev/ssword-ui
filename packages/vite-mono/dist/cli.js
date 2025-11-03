#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "node:path";
import fg from "fast-glob";
import fs from "node:fs";
import { loadConfigFromFile, build } from "vite";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { pathToFileURL } from "node:url";
class Logger {
  log(format, ...params) {
    console.log(format, ...params);
  }
}
const require2 = createRequire(fileURLToPath(import.meta.url));
function importJSON(filePath) {
  return require2(filePath);
}
function importPackageJSON(filePath) {
  return importJSON(path.resolve(filePath, "./package.json"));
}
async function workspaceEntries(root, packageObject) {
  if (!packageObject.workspaces) {
    return [];
  }
  const workspaces = await fg(packageObject.workspaces, {
    cwd: root,
    onlyDirectories: true,
    absolute: true
  });
  const aliasEntries = await Promise.all(
    workspaces.map(async (workspacePath) => {
      const workspacePackageFile = path.resolve(workspacePath, "package.json");
      const workspacePackageObject = await importJSON(workspacePackageFile);
      return [workspacePackageObject.name, workspacePath];
    })
  );
  return aliasEntries;
}
const globFiles = (root, pattern) => fg(pattern, {
  cwd: root,
  onlyFiles: true,
  braceExpansion: true,
  globstar: true,
  absolute: true
});
const globFile = (...args) => globFiles(...args).then((entries) => entries[0] ?? null);
const messages = {
  "config-not-found": "A Vite Config is required for workspace '%s' to be built. skipping workspace '%s' due to missing configuration...",
  "config-resolution-error": "An error occured while resolving a configuration for workspace '%s'.",
  "source-resolution-error": "Cannot resolve the source directory for '%s'."
};
const logger = new Logger();
class ViteMono {
  constructor(options) {
    const root = path.resolve(process.cwd(), options.root);
    this.root = root;
    this.package = importPackageJSON(root);
  }
  async getAllWorkspaceEntries() {
    return workspaceEntries(this.root, await this.package);
  }
  async getBuildConfiguration(workspaceName, workspaceAbsolutePath) {
    const viteConfigPath = await globFile(
      workspaceAbsolutePath,
      "vite.config.{cjs,mjs,js,cts,mts,ts}"
    );
    console.log(viteConfigPath);
    if (!viteConfigPath) {
      logger.log(messages["config-not-found"], workspaceName, workspaceName);
      return null;
    }
    const configResolutionResult = await loadConfigFromFile(
      {
        command: "build",
        mode: "production"
      },
      viteConfigPath,
      workspaceAbsolutePath,
      "silent",
      void 0,
      "runner"
    );
    if (!configResolutionResult) {
      logger.log(messages["config-resolution-error"], workspaceName);
      return null;
    }
    return configResolutionResult;
  }
  async getSourceDirectory(workspaceName, workspacePath) {
    let source = null;
    try {
      const pkg = await importJSON(path.resolve(workspacePath, "package.json"));
      if (pkg && typeof pkg.source === "string" && pkg.source.length > 0) {
        source = pkg.source;
      }
    } catch {
    }
    const popularNames = ["src", "source", "lib", "lib/src"];
    const candidates = source ? [source, ...popularNames] : popularNames;
    for (const cand of candidates) {
      const candPath = path.resolve(workspacePath, cand);
      if (fs.existsSync(candPath) && fs.statSync(candPath).isDirectory()) {
        source = cand;
        break;
      }
    }
    if (!source) {
      logger.log(messages["source-resolution-error"], workspaceName);
      return null;
    }
    return source;
  }
  async getAllWorkspaces(workspaceEntries2) {
    const workspaceMap = Object.fromEntries(workspaceEntries2);
    const workspaces = await Promise.all(
      workspaceEntries2.map(async ([workspaceName, workspacePath]) => {
        const workspaceBindingAliases = { ...workspaceMap };
        delete workspaceBindingAliases[workspaceName];
        const configResolutionResult = await this.getBuildConfiguration(
          workspaceName,
          workspacePath
        );
        if (!configResolutionResult) {
          return null;
        }
        const { config, path: viteConfigPath } = configResolutionResult;
        const source = await this.getSourceDirectory(workspaceName, workspacePath);
        if (!source) {
          return null;
        }
        return {
          config,
          workspaceBindingAliases,
          source,
          root: workspacePath,
          configFile: viteConfigPath
        };
      })
    );
    return workspaces.filter((w) => w !== null);
  }
  async build() {
    var _a;
    const workspaceEntries2 = await this.getAllWorkspaceEntries();
    const workspaces = await this.getAllWorkspaces(workspaceEntries2);
    for (const workspace of workspaces) {
      const mergedResolve = {
        ...workspace.config.resolve ?? {},
        alias: {
          ...((_a = workspace.config.resolve) == null ? void 0 : _a.alias) ?? {},
          ...workspace.workspaceBindingAliases
        }
      };
      await build({
        ...workspace.config,
        root: workspace.root,
        resolve: mergedResolve,
        forceOptimizeDeps: true,
        configFile: workspace.configFile,
        logLevel: "silent"
      });
    }
  }
}
async function bootstrap() {
  const args = await yargs(hideBin(process.argv)).option("config", {
    alias: "c",
    type: "string",
    default: "vite-mono.config.js",
    description: "Path to config file"
  }).parseAsync();
  const cwd = process.cwd();
  const configPath = args.config || "vite-mono.config.js";
  const vmConfigPath = path.resolve(cwd, configPath);
  let vmConfig;
  try {
    const loaded = require2(vmConfigPath);
    vmConfig = loaded && loaded.__esModule && loaded.default ? loaded.default : loaded;
  } catch {
    const fileUrl = pathToFileURL(vmConfigPath).href;
    const imported = await import(fileUrl);
    vmConfig = imported.default ?? imported;
  }
  if (!vmConfig || typeof vmConfig.root !== "string") {
    throw new TypeError(
      `Invalid ViteMono config loaded from ${vmConfigPath}. Expected an object with a string 'root' property.`
    );
  }
  const vm = new ViteMono(vmConfig);
  await vm.build();
}
bootstrap().catch(console.error);
//# sourceMappingURL=cli.js.map

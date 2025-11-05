#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "node:path";
import fg from "fast-glob";
import fs from "node:fs";
import { loadConfigFromFile, build } from "vite";
import { format } from "node:util";
import chalk from "chalk";
import { z } from "zod";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { isBuiltin } from "node:module";
import semverValid from "semver/functions/valid.js";
import { pathToFileURL } from "node:url";
const logFormats = {
  info: chalk.blue("[INFO]:") + " %s",
  warn: chalk.yellowBright.bgYellow("[WARN]:") + " " + chalk.yellow("%s"),
  error: chalk.redBright.bgRed("[ERROR]") + " " + chalk.red("%s"),
  fatal: chalk.redBright.bgRed("FATAL") + " " + chalk.red("%s")
};
class Logger {
  constructor() {
    this.warnOnceCache = /* @__PURE__ */ new Set();
    this.hasOnceWarnLogged = false;
    this.hasOnceErrorLogged = false;
  }
  hasWarned() {
    return this.hasOnceWarnLogged;
  }
  hasErrorLogged() {
    return this.hasOnceErrorLogged;
  }
  format(format$1, ...params) {
    return format(format$1, ...params);
  }
  log(message, logLevel = "info") {
    console.log(this.format(logFormats[logLevel], message));
  }
  info(...args) {
    this.log(...args);
  }
  warn(message, logLevel = "warn") {
    if (!this.hasOnceWarnLogged) {
      this.hasOnceWarnLogged = true;
    }
    console.warn(this.format(logFormats[logLevel], message));
  }
  warnOnce(message, logLevel = "warn") {
    if (this.warnOnceCache.has(message + logLevel)) {
      return;
    }
    this.warn(message, logLevel);
    this.warnOnceCache.add(message + logLevel);
  }
  error(message, logLevel = "error") {
    if (!this.hasOnceErrorLogged) {
      this.hasOnceErrorLogged = true;
    }
    console.error(this.format(logFormats[logLevel], message));
  }
  clearScreen() {
    console.clear();
  }
}
const require2 = createRequire(fileURLToPath(import.meta.url));
const JSONSchema = z.lazy(
  () => z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.record(z.string(), JSONSchema),
    z.array(JSONSchema)
  ])
);
const json = () => z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.record(
    z.string(),
    z.lazy(() => json())
  ),
  z.array(z.lazy(() => json()))
]);
const PackageSemVerSchema = z.string().superRefine((ver, context) => {
  const validity = semverValid(ver);
  if (!validity) {
    context.addIssue({
      code: "custom",
      message: "Invalid Semantic Version",
      input: ver
    });
  }
});
const PackageNameSchema = z.string().min(1).max(214).superRefine((name, context) => {
  if (isBuiltin(name)) {
    context.addIssue({
      code: "custom",
      message: "Cannot use a built in node module name."
    });
  }
  if (!/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name)) {
    context.addIssue({
      code: "custom",
      message: "packages should  adhere to the npm package spec."
    });
  }
});
const ModuleTypeSchema = z.enum(["module", "commonjs"]);
const RepositoryObjectSchema = z.object({
  type: z.string().optional(),
  url: z.string().optional(),
  directory: z.string().optional()
});
const RepositoryFieldSchema = z.union([z.string(), RepositoryObjectSchema]);
const BugsFieldSchema = z.object({
  url: z.string().optional(),
  email: z.string().optional()
});
const PersonSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    email: z.string().optional(),
    url: z.string().optional()
  })
]);
const DependenciesMapSchema = z.record(z.string(), z.string());
const ExportsFieldSchema = z.lazy(
  () => z.union([
    z.string(),
    z.record(z.string(), z.union([ExportsFieldSchema, z.record(z.string(), ExportsFieldSchema)]))
  ])
);
const WorkspacesFieldSchema = z.union([
  z.array(z.string()),
  z.object({
    packages: z.array(z.string()),
    nohoist: z.array(z.string()).optional()
  })
]);
z.object({
  // Identity
  name: PackageNameSchema,
  version: PackageSemVerSchema.optional(),
  private: z.boolean().optional(),
  type: ModuleTypeSchema.optional(),
  // Descriptive fields
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  homepage: z.string().optional(),
  repository: RepositoryFieldSchema.optional(),
  bugs: BugsFieldSchema.optional(),
  license: z.string().optional(),
  // People
  author: PersonSchema.optional(),
  contributors: z.array(PersonSchema).optional(),
  maintainers: z.array(PersonSchema).optional(),
  // Entry points & files
  main: z.string().optional(),
  module: z.string().optional(),
  browser: z.union([z.string(), z.record(z.string(), z.string())]).optional(),
  types: z.string().optional(),
  typings: z.string().optional(),
  files: z.array(z.string()).optional(),
  exports: z.union([ExportsFieldSchema, z.record(z.string(), ExportsFieldSchema)]).optional(),
  bin: z.union([z.string(), z.record(z.string(), z.string())]).optional(),
  man: z.union([z.string(), z.array(z.string())]).optional(),
  // Dependency fields
  dependencies: DependenciesMapSchema.optional(),
  devDependencies: DependenciesMapSchema.optional(),
  peerDependencies: DependenciesMapSchema.optional(),
  optionalDependencies: DependenciesMapSchema.optional(),
  bundledDependencies: z.array(z.string()).optional(),
  bundleDependencies: z.array(z.string()).optional(),
  // Workspaces / monorepo
  workspaces: WorkspacesFieldSchema.optional()
}).catchall(json());
function loadPackageJSON(nameOrPath) {
  try {
    if (path.isAbsolute(nameOrPath)) {
      const pkgPath = path.resolve(nameOrPath, "./package.json");
      return require2(pkgPath);
    }
    return require2(`${nameOrPath}/package.json`);
  } catch {
    return null;
  }
}
function readPackageJSON(dir) {
  return loadPackageJSON(dir) ?? {};
}
async function workspaceEntries(root, pkg) {
  const workspacesField = pkg.workspaces;
  if (!workspacesField) return [];
  const workspaces = await fg(workspacesField, {
    cwd: root,
    onlyDirectories: true,
    absolute: true
  });
  return workspaces.map((workspacePath) => {
    const workspacePkg = readPackageJSON(workspacePath);
    return [workspacePkg.name ?? workspacePath, workspacePath];
  });
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
function logf(format2, ...params) {
  logger.log(logger.format(format2, ...params));
}
class ViteMono {
  constructor(options) {
    const root = path.resolve(process.cwd(), options.root);
    this.root = root;
    this.package = Promise.resolve(readPackageJSON(root));
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
      logf(messages["config-not-found"], workspaceName, workspaceName);
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
      logf(messages["config-resolution-error"], workspaceName);
      return null;
    }
    return configResolutionResult;
  }
  async getSourceDirectory(workspaceName, workspacePath) {
    let source = null;
    try {
      const pkg = loadPackageJSON(workspacePath);
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
      logf(messages["source-resolution-error"], workspaceName);
      return null;
    }
    return source;
  }
  async getAllWorkspaces(workspaceEntries2) {
    const workspaces = await Promise.all(
      workspaceEntries2.map(async ([workspaceName, workspacePath]) => {
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
        const workspaceBindingAlias = {
          name: workspaceName,
          source
        };
        const workspaceBinding = {
          alias: workspaceBindingAlias
        };
        return {
          config,
          workspaceBinding,
          source,
          root: workspacePath,
          configFile: viteConfigPath
        };
      })
    );
    return workspaces.filter((w) => w !== null);
  }
  // returns a set of workspace binding aliases as a map
  // to be used for vite config.
  getWorkspaceBindingAliasMap(workspaces) {
    return Object.fromEntries(
      workspaces.map((ws) => [ws.workspaceBinding.alias.name, ws.workspaceBinding.alias.source])
    );
  }
  finalAliasMapFor(workspace, bindingAliasMap) {
    const clone = { ...bindingAliasMap };
    delete clone[workspace.workspaceBinding.alias.name];
    return clone;
  }
  async build() {
    var _a;
    try {
      const workspaceEntries2 = await this.getAllWorkspaceEntries();
      const workspaces = await this.getAllWorkspaces(workspaceEntries2);
      const workspaceBindingAliasMap = this.getWorkspaceBindingAliasMap(workspaces);
      for (const workspace of workspaces) {
        const mergedResolve = {
          ...workspace.config.resolve ?? {},
          alias: {
            ...((_a = workspace.config.resolve) == null ? void 0 : _a.alias) ?? {},
            ...this.finalAliasMapFor(workspace, workspaceBindingAliasMap)
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
    } catch (e) {
      logger.error(String(e));
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

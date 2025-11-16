// core/events module
// manages synthetic events and event dispatching.

import { getCurrentInstance } from 'vue';
import type { ComponentInternalInstance } from 'vue';

// unique symbol for `instanceof` checks.
const SYNTHETIC: unique symbol = Symbol('SYNTHETIC');

type SyntheticEventProperties<B> = {
	baseEvent: B;
	propagationPrevented: boolean;
	[SYNTHETIC]: true;
};

export type SyntheticEvent<M extends object = object, B extends Event = Event> = B &
	SyntheticEventProperties<B> &
	Omit<M, keyof SyntheticEventProperties<B>>;

// constructor properties and static methods.
// could have used a namespace, but this is
// cleaner for type-hacking.
export interface SyntheticEventConstructor {
	/**
	 * @deprecated SyntheticEvent cannot be instantiated directly and will
	 * throw an error at runtime. Use the static `createInstance` method instead.
	 */
	new (): never;

	/**
	 * This prototype is resolved at runtime
	 * and is not truly attached to the synthetic
	 * event.
	 */
	prototype: SyntheticEvent<object, Event>;

	/**
	 * @param eventBase The base event to wrap.
	 * @param metadata The metadata to attach to the synthetic event.
	 * @returns A new SyntheticEvent instance.
	 */
	createInstance<M extends object, B extends Event = Event>(
		eventBase: B,
		metadata: M,
	): SyntheticEvent<M, B>;
}

/**
 * An event dispatcher tied to a component instance.
 */
interface EventDispatcher {
	dispatch<E extends Event>(type: string, metadataOrEvent: E): SyntheticEvent<object, E>;
	dispatch<M extends object>(type: string, metadataOrEvent: M): SyntheticEvent<M, Event>;
}

// prototype
class SyntheticEventInstance {
	constructor() {
		throw new Error(
			'Cannot call SyntheticEvent as a constructor, use the factory method `SyntheticEvent.createInstance(...)` method instead.',
		);
	}

	// marker for `instanceof` checks.
	get [SYNTHETIC]() {
		return true;
	}

	/**
	 * Stops the propagation of the synthetic event.
	 */
	stopPropagation(): void {
		(this as unknown as SyntheticEvent).propagationPrevented = true;
		(this as unknown as SyntheticEvent).baseEvent.stopPropagation();
	}

	/**
	 * Stops the immediate propagation of the synthetic event. (same thing as stopPropagation).
	 */
	stopImmediatePropagation(): void {
		this.stopPropagation(); // just forward.
	}

	// static methods
	static createInstance(eventBase: Event, metadata: object): SyntheticEvent {
		return createSyntheticEvent(eventBase, metadata);
	}

	// internal instance initializer.
	// it is like the constructor body but
	// more cleaner because i do not have to
	// fight with Javascript constructor semantics.
	static initInstance(instance: SyntheticEvent) {
		instance.propagationPrevented = false;
	}

	// instanceof checks.
	static [Symbol.hasInstance](o: unknown) {
		if (typeof o !== 'object') {
			return false;
		}

		return (o as { [SYNTHETIC]?: boolean })[SYNTHETIC] === true;
	}
}

/**
 *
 * `typeof eventManager`
 * manages event dispatchers tied to component instances.
 */
interface EventManager {
	SyntheticEvent: SyntheticEventConstructor;
	getCurrentDispatcher(): EventDispatcher;
}

const dispatcherCache: WeakMap<ComponentInternalInstance, EventDispatcher> = new WeakMap();

// helper to bind a method if it is a function.
function bindIfFunctionMethod(functionOrValue: unknown, instance: unknown): unknown {
	return typeof functionOrValue === 'function' ? functionOrValue.bind(instance) : functionOrValue;
}

// resolves prototype properties
function resolvePrototype(p: PropertyKey, cls: Function, instance: object): unknown {
	const proto = cls.prototype as object;
	const nullInstance = Object.create(proto) as object;

	if (Reflect.has(nullInstance, p)) {
		return Reflect.get(nullInstance, p, instance);
	}

	return undefined;
}

// internal function to create synthetic
// events from regular events and a metadata
// object.
function createSyntheticEvent(eventBase: Event, metadata: object): SyntheticEvent {
	// so the actual event do not get their properties overwritten.
	const dynamicPrototype = {
		[SYNTHETIC]: true,
		baseEvent: eventBase,
	};

	const overrides: Record<PropertyKey, unknown> = {};

	const syntheticEvent = new Proxy<SyntheticEvent>(eventBase as SyntheticEvent, {
		get(target, p, receiver) {
			// dynamic top-level 'prototype'
			if (p in dynamicPrototype) {
				return Reflect.get(dynamicPrototype, p, receiver);
			}

			// shadow.
			if (p in overrides) {
				return Reflect.get(overrides, p, receiver);
			}

			// metadata layer (readonly).
			if (p in metadata) {
				return Reflect.get(metadata, p, receiver);
			}

			// prototype and event.
			return (
				resolvePrototype(p, Event, eventBase) ??
				resolvePrototype(p, SyntheticEventInstance, syntheticEvent) ??
				bindIfFunctionMethod(Reflect.get(eventBase, p), eventBase)
			);
		},

		set(target, p, newValue, receiver) {
			return Reflect.set(overrides, p, newValue, receiver);
		},
	});

	SyntheticEventInstance.initInstance(syntheticEvent);

	return syntheticEvent;
}

function createDispatcher(instance: ComponentInternalInstance): EventDispatcher {
	// closure
	const emit = instance.emit.bind(instance);

	return {
		dispatch(type: string, metadata: Event | object) {
			let syntheticEvent: SyntheticEvent;

			if (metadata instanceof Event) {
				syntheticEvent = createSyntheticEvent(metadata, {});
			} else {
				const eventBase = new Event(type);
				syntheticEvent = createSyntheticEvent(eventBase, metadata);
			}

			emit(type, syntheticEvent);
			return syntheticEvent; // allow the caller to use the synthetic event.
		},
	};
}

let cachedNullDispatcher: EventDispatcher;

function createNullDispatcher(): EventDispatcher {
	if (!cachedNullDispatcher)
		cachedNullDispatcher = {
			dispatch(type: string, metadata: Event | object) {
				let syntheticEvent: SyntheticEvent;

				if (metadata instanceof Event) {
					syntheticEvent = createSyntheticEvent(metadata, {});
				} else {
					const eventBase = new Event(type);
					syntheticEvent = createSyntheticEvent(eventBase, metadata);
				}

				return syntheticEvent; // allow the caller to use the synthetic event.
			},
		};

	return cachedNullDispatcher;
}

// `eventManager.getCurrentDispatcher` implementation.
// internally is just an impure function that
// relies on Vue's internal instance for context tracking
// as we dont want our dispatcher to be able to emit events
// outside of the current component instance. that is probably not
// the intent when using this.
function getCurrentDispatcher(): EventDispatcher {
	// get vue's internal component instance.
	const currentInstance = getCurrentInstance();

	// ensure we actually have an active component instance.
	// (or we are inside of a setup function).
	// if we are on the server, create a null dispatcher.
	if (!currentInstance) {
		if (import.meta.server) {
			return createNullDispatcher();
		}

		throw new Error('Attempted to get the current dispatcher outside of an active setup context.');
	}

	// check cache first.
	// so we do not create multiple dispatchers
	// for the same component instance.
	if (dispatcherCache.has(currentInstance)) {
		return dispatcherCache.get(currentInstance)!;
	}

	// create a new dispatcher.
	// we pass in the component instance
	// because we want the dispatcher to be able
	// to access the `emit` function tied to the component
	// instance.
	const dispatcher = createDispatcher(currentInstance);

	// cache it.
	dispatcherCache.set(currentInstance, dispatcher);

	// return the new dispatcher.
	return dispatcher;
}

// also export the SyntheticEvent constructor.
const SyntheticEvent = SyntheticEventInstance as unknown as SyntheticEventConstructor;

// the namespace / api export.
const eventManager: EventManager = { getCurrentDispatcher, SyntheticEvent };

export default eventManager;

import { describe, it, expect, vi } from 'vitest';
import eventManager from '../../../../packages/ui-vue/src/core/events';
import type { SyntheticEvent } from '../../../..//packages/ui-vue/src/core/events';
import { defineComponent, h } from 'vue';
import { render } from '@testing-library/vue';
import { mount } from '@vue/test-utils';

// core/events module
// manages synthetic events and event dispatching.
describe('events', () => {
	// extract the constructor for easier access
	// so i do not have to type in eventManager.SyntheticEvent
	// everywhere.
	const { SyntheticEvent } = eventManager;

	// SyntheticEvent
	// describes a wrapper around native / custom events that adds utilities
	// and allows atatching metadata to events via the event manager.
	describe('SyntheticEvent', () => {
		// ensure the constructor adheres to the spec
		// (not intended to be instantiated directly).
		it('should have a static method named createInstance to create synthetic events', () => {
			expect(typeof SyntheticEvent.createInstance).toBe('function');

			const baseEvent = new Event('foo');
			const se = SyntheticEvent.createInstance(baseEvent, {});

			expect(se).toBeInstanceOf(SyntheticEvent);
			expect(se.baseEvent).toBe(baseEvent);
			expect(se.type).toBe('foo');
		});

		// ensure metadata properties are properly reflected
		// on the synthetic event.
		it('should properly reflect metadata properties on the synthetic event', () => {
			const eventMetadata = { foo: 'bar', baz: 42 };

			const baseEvent = new Event('foo');
			const se = SyntheticEvent.createInstance(baseEvent, eventMetadata);

			expect(se.foo).toBe('bar');
			expect(se.baz).toBe(42);
		});

		// ensure intrinsic event properties and prototype chain works as expected.
		it('should properly reflect event properties and prototype on synthetic event', () => {
			const baseEvent = new MouseEvent('click', { clientX: 100, clientY: 150 });
			const se = SyntheticEvent.createInstance(baseEvent, {});

			expect(se.type).toBe('click');
			expect(se.clientX).toBe(100);
			expect(se.clientY).toBe(150);
			expect(se.baseEvent instanceof MouseEvent).toBe(true);
		});
	});

	// eventManager
	// manages event and generating dispatchers tied to the component
	// instance.
	describe('eventManager', () => {
		// ensure the method to get the current dispatcher exists.
		it('should have a getCurrentDispatcher method', () => {
			expect(typeof eventManager.getCurrentDispatcher).toBe('function');
		});

		// ensure calling the method outside of a component setup context
		// will throw an error.
		it('should throw an error outside of component setup context', () => {
			expect(() => eventManager.getCurrentDispatcher()).toThrowError();
		});

		// ensure that dispatching an event via the dispatcher
		// works as expected.
		it('should dispatch a synthetic event with metadata', async () => {
			const onFoo = vi.fn();

			const Comp = defineComponent({
				setup(_, __) {
					// ensure dispatcher is tied to this component instance
					const dispatcher = eventManager.getCurrentDispatcher();

					function trigger() {
						dispatcher.dispatch('foo', { extra: 123 });
					}

					return () => h('button', { onClick: trigger });
				},
				emits: ['foo'],
			});

			const result = mount(Comp, {
				attrs: { onFoo },
			});

			// simulate click to trigger our dispatch
			await result.trigger('click');

			expect(onFoo).toHaveBeenCalledTimes(1);

			//
			const eventArg = onFoo.mock.calls[0]![0] as SyntheticEvent<{ extra: number }, PointerEvent>;

			// basic structural checks
			expect(eventArg).toBeInstanceOf(SyntheticEvent);
			expect(SyntheticEvent[Symbol.hasInstance](eventArg)).toBe(true);
			expect(eventArg.baseEvent).toBeInstanceOf(Event);
			expect(eventArg.extra).toBe(123);
			expect(eventArg.propagationPrevented).toBe(false);

			// behavior check
			eventArg.stopPropagation();
			expect(eventArg.propagationPrevented).toBe(true);
		});

		// ensure that multiple calls to getCurrentDispatcher
		// just returns the same dispatcher instance for the current
		// component instance.
		it('should cache dispatcher per component instance', () => {
			const Comp = defineComponent({
				setup() {
					const d1 = eventManager.getCurrentDispatcher();
					const d2 = eventManager.getCurrentDispatcher();
					expect(d1).toBe(d2); // same instance
					return () => null;
				},
			});

			render(Comp);
		});
	});
});

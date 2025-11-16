import { clsx } from '@ssword/utils';
import { defineComponent, type DefineComponent } from 'vue';

interface SlotProps {
	as?: string | DefineComponent;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SlotComponent extends DefineComponent<SlotProps> {}

const Slot: SlotComponent = defineComponent({
	// eslint-disable-next-line vue/no-reserved-component-names
	name: 'Slot',
	props: {
		as: {
			type: [String, Object, Function],
			default: undefined,
		},
	},
	setup(props: SlotProps, { attrs, slots }) {
		return () => {
			const children = slots.default?.();

			if (!children || children.length === 0) {
				return null;
			}

			const vNode = children[0];

			if (props.as) {
				return (
					<component
						is={props.as}
						{...attrs}
					>
						{children}
					</component>
				);
			}

			if (!vNode || typeof vNode.type === 'symbol' || typeof vNode.type === 'string') {
				return vNode;
			}

			// Merge props for component children
			const vNodeProps = vNode.props || {};
			const mergedProps = { ...vNodeProps };

			Object.assign(mergedProps, attrs);

			// Merge classes
			if (attrs.class || vNodeProps.class) {
				mergedProps.class = clsx(vNodeProps.class, attrs.class as string | undefined);
			}

			// Merge styles
			if (attrs.style || vNodeProps.style) {
				mergedProps.style = {
					...vNodeProps.style,
					...((attrs.style as object | undefined) || {}),
				};
			}

			const Comp = vNode.type as DefineComponent;
			return <Comp {...mergedProps}>{vNode.children}</Comp>;
		};
	},
}) as SlotComponent;

export default Slot;

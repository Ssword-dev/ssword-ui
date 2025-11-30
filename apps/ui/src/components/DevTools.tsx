'use client';
import { Box, Screen, Services, Button, Stack } from '@ssword-ui/react';
import { Key, MousePointer } from 'lucide-react';
import {
	useRef,
	useCallback,
	useState,
	useEffect,
	useContext,
	createContext,
	PropsWithChildren,
	forwardRef,
} from 'react';
import { createPortal } from 'react-dom';

interface Propagatable {
	stopPropagation(): void;
}

function noPropagate(evt: Propagatable) {
	evt.stopPropagation();
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function useDebounce<T extends Function>(callback: T, duration = 1000 / 60): T {
	const timeoutRef = useRef<number | null>(null);

	const debounced = useCallback(
		(...args: unknown[]) => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = window.setTimeout(() => {
				callback(...args);
				timeoutRef.current = null;
			}, duration);
		},
		[callback, duration],
	);

	return debounced as unknown as T;
}

interface DevToolsSelectionContextValue {
	// selection mode
	selecting: boolean;
	setSelecting: React.Dispatch<React.SetStateAction<boolean>>;

	// the hovered/selected element
	selectedElement: HTMLElement | null;
	setSelectedElement: (el: HTMLElement | null) => void;

	// functions that perform selection
	selectElement: (coords: { x: number; y: number }) => void;

	// refs needed by the inspector
	elementOverlayRef: React.RefObject<HTMLDivElement | null>;
	boxModelOverlayRefs: React.RefObject<Set<HTMLDivElement>>;

	addBoxModelOverlay(el: HTMLDivElement): void;
}

const SelectContext = createContext<DevToolsSelectionContextValue | null>(null);

function DevToolsSelect({ children }: PropsWithChildren) {
	const selectFrameRate = 60;

	const elementOverlayRef = useRef<HTMLDivElement>(null);
	const boxModelOverlayRefs = useRef<Set<HTMLDivElement>>(new Set());
	const [selecting, setSelecting] = useState(false);
	const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

	const getIntendedSelectedElement = ({ x, y }: { x: number; y: number }) => {
		const targets = document.elementsFromPoint(x, y);
		let target: HTMLElement | null = null;

		target =
			(targets.filter(
				(el) =>
					!boxModelOverlayRefs.current.has(el as HTMLDivElement) &&
					el !== elementOverlayRef.current,
			)[0] as HTMLElement) ?? null;

		return target;
	};

	const selectElement = useCallback(({ x, y }: { x: number; y: number }) => {
		const intendedTarget = getIntendedSelectedElement({ x, y });
		setSelectedElement(intendedTarget);
	}, []);

	const addBoxModelOverlay = (el: HTMLDivElement) => {
		boxModelOverlayRefs.current.add(el);
	};

	const handleClick = useCallback(() => {
		setSelecting(false);
	}, []);

	const handleMouseMove = useDebounce((evt: MouseEvent) => {
		if (!selecting) return;
		selectElement({ x: evt.clientX, y: evt.clientY });
	}, 1000 / selectFrameRate);

	const handleScroll = useCallback(() => {
		if (!selecting || !selectedElement) return;
		const rect = selectedElement.getBoundingClientRect();

		selectElement({ x: rect.left, y: rect.top });
	}, [selecting, selectElement, selectedElement]);

	useEffect(() => {
		const controller = new AbortController();

		window.addEventListener('click', handleClick);

		window.addEventListener('mousemove', handleMouseMove, {
			signal: controller.signal,
		});
		window.addEventListener('scroll', handleScroll, {
			signal: controller.signal,
		});

		return () => controller.abort();
	}, [handleClick, handleMouseMove, handleScroll]);

	useEffect(() => {
		const overlay = elementOverlayRef.current;
		if (!overlay) return;

		if (!selecting || !selectedElement) {
			overlay.style.display = 'none';
			return;
		}

		const rect = selectedElement.getBoundingClientRect();
		const style = getComputedStyle(selectedElement);

		overlay.style.display = 'block';
		overlay.style.position = 'absolute';
		overlay.style.left = `${rect.left}px`;
		overlay.style.top = `${rect.top}px`;
		overlay.style.width = `${rect.width}px`;
		overlay.style.height = `${rect.height}px`;
		overlay.style.borderRadius = style.borderRadius;
	}, [selecting, selectedElement]);

	return (
		<SelectContext.Provider
			value={{
				selecting,
				setSelecting,
				selectedElement,
				selectElement,
				setSelectedElement,
				elementOverlayRef,
				boxModelOverlayRefs,
				addBoxModelOverlay,
			}}
		>
			{children}
		</SelectContext.Provider>
	);
}

function useDevToolsSelect() {
	const context = useContext(SelectContext);

	if (!context) {
		throw new Error('useDevToolsSelect can only be used inside DevToolsSelect.');
	}

	return context;
}

function DevToolsSelectToggle() {
	const { setSelecting } = useDevToolsSelect();
	return (
		<Box
			className="z-10001 relative"
			justify="end"
			align="end"
		>
			<Button
				className={[
					'w-12 rounded-full aspect-square mb-5 mr-5 flex flex-col justify-center items-center pointer-events-auto',
				]}
				onClick={(evt) => {
					noPropagate(evt);
					setSelecting((selecting) => !selecting);
				}}
			>
				<MousePointer />
			</Button>
		</Box>
	);
}

function getBoxModel(element: HTMLElement) {
	const style = getComputedStyle(element);
	const rect = element.getBoundingClientRect();

	const margin = {
		top: parseFloat(style.marginTop),
		right: parseFloat(style.marginRight),
		bottom: parseFloat(style.marginBottom),
		left: parseFloat(style.marginLeft),
	};

	const padding = {
		top: parseFloat(style.paddingTop),
		right: parseFloat(style.paddingRight),
		bottom: parseFloat(style.paddingBottom),
		left: parseFloat(style.paddingLeft),
	};

	const border = {
		top: parseFloat(style.borderTopWidth),
		right: parseFloat(style.borderRightWidth),
		bottom: parseFloat(style.borderBottomWidth),
		left: parseFloat(style.borderLeftWidth),
	};

	return {
		rect,
		margin,
		padding,
		border,
	};
}

function overlayBoxes(element: HTMLElement) {
	const { rect, margin, padding, border } = getBoxModel(element);

	const marginBox = {
		x: rect.x - margin.left,
		y: rect.y - margin.top,
		width: rect.width + margin.left + margin.right,
		height: rect.height + margin.top + margin.bottom,
	};

	const borderBox = {
		x: rect.x,
		y: rect.y,
		width: rect.width,
		height: rect.height,
	};

	const paddingBox = {
		x: rect.x + border.left,
		y: rect.y + border.top,
		width: rect.width - border.left - border.right,
		height: rect.height - border.top - border.bottom,
	};

	const contentBox = {
		x: rect.x + border.left + padding.left,
		y: rect.y + border.top + padding.top,
		width: rect.width - border.left - border.right - padding.left - padding.right,
		height: rect.height - border.top - border.bottom - padding.top - padding.bottom,
	};

	return {
		marginBox,
		borderBox,
		paddingBox,
		contentBox,
	};
}

interface OverlayBoxDescription {
	x: number;
	y: number;
	width: number;
	height: number;
}

const OverlayBox = forwardRef<HTMLDivElement, OverlayBoxDescription>(function OverlayBox(
	{ x, y, width, height },
	forwardedRef,
) {
	return (
		<Box
			// abuse the heck out of transitions.
			className="outline-accent outline-1 pointer-events-none transition-all duration-200"
			style={{ position: 'absolute', left: x, top: y, width, height }}
			ref={forwardedRef}
		/>
	);
});

function DevToolsSelectedElementBoxModelOverlay() {
	const { selectElement, selectedElement, elementOverlayRef, addBoxModelOverlay } =
		useDevToolsSelect();
	return (
		<>
			{selectedElement &&
				Object.entries(overlayBoxes(selectedElement)).map(([key, props]) => (
					<OverlayBox
						{...props}
						key={key}
						ref={addBoxModelOverlay}
					/>
				))}
		</>
	);
}

function DevTools() {
	return createPortal(
		<div className="absolute h-full w-full flex flex-col pointer-events-none">
			<DevToolsSelect>
				{/*  */}
				<Stack
					order="reversed"
					asChild
				>
					<Screen>
						<DevToolsSelectToggle />
					</Screen>
				</Stack>
				<DevToolsSelectedElementBoxModelOverlay />
			</DevToolsSelect>
		</div>,
		document.body,
	);
}

export default DevTools;

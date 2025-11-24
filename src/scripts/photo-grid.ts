import justifiedLayout from 'justified-layout';


interface JustifiedLayoutResult {
	/**
	 * Height of the container containing the justified layout.
	 */
	containerHeight: number;
	/**
	 * Number of items that are in rows that aren't fully-packed.
	 */
	widowCount: number;
	/**
	 * Computed positional and sizing properties of a box in the justified layout.
	 */
	boxes: LayoutBox[];
}

/**
 * Computed positional and sizing properties of a box in the layout.
 */
interface LayoutBox {
	/**
	 * Aspect ratio of the box.
	 */
	aspectRatio: number;
	/**
	 * Distance between the top side of the box and the top boundary of the justified layout.
	 */
	top: number;
	/**
	 * Width of the box in a justified layout.
	 */
	width: number;
	/**
	 * Height of the box in a justified layout.
	 */
	height: number;
	/**
	 * Distance between the left side of the box and the left boundary of the justified layout.
	 */
	left: number;
	/**
	 * Whether or not the aspect ratio was forced.
	 */
	forcedAspectRatio?: boolean;
}

export async function setupGallery() {
	if (typeof document === 'undefined') return;

	const container = document.getElementById('photo-grid');
	if (!container) {
		console.error('Photo grid container not found.');
		return;
	}

	const imageLinks = Array.from(container.querySelectorAll('.photo-item')) as HTMLElement[];
	if (!imageLinks.length) return;

	// Build initial layout immediately from data-width/data-height (no network wait)
	const initialLayout = createLayoutFromData(imageLinks, container);
	applyImagesStyleBasedOnLayout(imageLinks, initialLayout);
	applyContainerStyleBasedOnLayout(container, initialLayout);

	// Refine after all images have loaded (non-blocking)
	refineLayoutAfterLoads(container, imageLinks);
}

function createLayoutFromData(items: HTMLElement[], container: HTMLElement): JustifiedLayoutResult {
	const sizes = items.map((el) => {
		const w = parseInt(el.dataset.width || '300', 10);
		const h = parseInt(el.dataset.height || '200', 10);
		return { width: w, height: h };
	});
	return justifiedLayout(sizes, {
		containerWidth: container.clientWidth || window.innerWidth,
		targetRowHeight: 300,
		boxSpacing: 10,
		containerPadding: 0,
	});
}

function refineLayoutAfterLoads(container: HTMLElement, items: HTMLElement[]) {
	const imgs = Array.from(container.querySelectorAll('img')) as HTMLImageElement[];
	if (!imgs.length) return;
	let loaded = 0;
	const total = imgs.length;
	const check = () => {
		loaded++;
		if (loaded === total) {
			const refined = createLayoutFromData(items, container);
			applyImagesStyleBasedOnLayout(items, refined);
			applyContainerStyleBasedOnLayout(container, refined);
		}
	};
	imgs.forEach((img) => {
		if (img.complete) {
			check();
		} else {
			img.addEventListener('load', check, { once: true });
			img.addEventListener('error', check, { once: true });
		}
	});
}

function applyImagesStyleBasedOnLayout(imageLinks: HTMLElement[], layout: JustifiedLayoutResult) {
	imageLinks.forEach((el, i) => {
		if (!layout.boxes[i]) return;
		const { left, top, width, height } = layout.boxes[i];

		el.style.position = 'absolute';
		el.style.left = `${left}px`;
		el.style.top = `${top}px`;
		el.style.width = `${width}px`;
		el.style.height = `${height}px`;
		el.style.display = 'block';
	});
}

function applyContainerStyleBasedOnLayout(container: HTMLElement, layout: JustifiedLayoutResult) {
	// Ensure the parent container has relative positioning
	container.style.position = 'relative';
	// Set container height
	container.style.height = `${layout.containerHeight}px`;
}
// Run setupGallery once the page is loaded
if (typeof window !== 'undefined') {
	const debouncedSetup = debounce(setupGallery, 250);

	document.addEventListener('DOMContentLoaded', setupGallery);
	window.addEventListener('resize', debouncedSetup);
}

// Debounce helper
function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number) {
	let timeout: ReturnType<typeof setTimeout>;
	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

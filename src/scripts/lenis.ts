import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let unsubscribeScroll: (() => void) | null = null;

function destroyLenis() {
	if (tickerCallback) {
		gsap.ticker.remove(tickerCallback);
		tickerCallback = null;
	}

	unsubscribeScroll?.();
	unsubscribeScroll = null;

	lenis?.destroy();
	lenis = null;
}

export function initLenis() {
	destroyLenis();

	if (document.body.dataset.smoothScroll === 'false') {
		ScrollTrigger.refresh();
		return null;
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

	lenis = new Lenis({
		anchors: true,
	});

	unsubscribeScroll = lenis.on('scroll', ScrollTrigger.update);

	tickerCallback = (time: number) => {
		lenis?.raf(time * 1000);
	};
	// Run Lenis before other GSAP updates to avoid measure-after-mutate reflow jitter
	gsap.ticker.add(tickerCallback, false, true);
	gsap.ticker.lagSmoothing(0);

	ScrollTrigger.refresh();

	return lenis;
}

export function getLenis() {
	return lenis;
}

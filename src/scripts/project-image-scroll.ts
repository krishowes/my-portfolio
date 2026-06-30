import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const triggers: ScrollTrigger[] = [];

export function initProjectImageScroll() {
	triggers.forEach((t) => t.kill());
	triggers.length = 0;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	document.querySelectorAll<HTMLElement>('.project-collage-row').forEach((row) => {
		const frames = [...row.querySelectorAll<HTMLElement>('[data-project-image]')];
		if (!frames.length) return;

		frames.forEach((frame, i) => {
			const inner = frame.querySelector<HTMLElement>('.project-image__inner');
			if (!inner) return;

			// OUTFIT-style: image rises inside a fixed mask (no card fade/slide)
			const reveal = gsap.fromTo(
				inner,
				{ yPercent: 108, scale: 1.08 },
				{
					yPercent: 0,
					scale: 1,
					ease: 'none',
					scrollTrigger: {
						trigger: frame,
						start: `top bottom-=${i * 48}`,
						end: 'top 55%',
						scrub: 0.45,
					},
				},
			);
			if (reveal.scrollTrigger) triggers.push(reveal.scrollTrigger);

			// Subtle vertical parallax while the frame travels through the viewport
			const drift = gsap.fromTo(
				inner,
				{ yPercent: 8, scale: 1.06 },
				{
					yPercent: -8,
					scale: 1,
					ease: 'none',
					scrollTrigger: {
						trigger: frame,
						start: 'top bottom',
						end: 'bottom top',
						scrub: 0.85,
					},
				},
			);
			if (drift.scrollTrigger) triggers.push(drift.scrollTrigger);
		});
	});

	ScrollTrigger.refresh();
}

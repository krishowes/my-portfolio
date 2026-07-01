import gsap from 'gsap';

const SCALE_START = 1.3;
const CLIP_START = '30%';

let observer: IntersectionObserver | null = null;

/** Remove clip wrapper and all GSAP inline styles — static img only. */
function lockReveal(frame: HTMLElement) {
	const clip = frame.querySelector<HTMLElement>('.project-image__clip');
	const img = clip?.querySelector<HTMLImageElement>('img');
	if (!clip || !img) {
		frame.classList.add('is-revealed');
		return;
	}

	gsap.killTweensOf([clip, img]);
	gsap.set([clip, img], { clearProps: 'all' });
	frame.replaceChildren(img);
	frame.classList.add('is-revealed');
	delete frame.dataset.revealing;
}

function playReveal(frame: HTMLElement) {
	if (frame.classList.contains('is-revealed') || frame.dataset.revealing === 'true') return;

	const clip = frame.querySelector<HTMLElement>('.project-image__clip');
	const img = clip?.querySelector<HTMLElement>('img');
	if (!clip || !img) return;

	frame.dataset.revealing = 'true';

	gsap.set(clip, { width: CLIP_START });
	gsap.set(img, { scale: SCALE_START, transformOrigin: 'center center' });

	gsap
		.timeline({ onComplete: () => lockReveal(frame) })
		.to(clip, { width: '100%', duration: 1.2, ease: 'power4.out' }, 0)
		.to(img, { scale: 1, duration: 1, ease: 'power4.out' }, 0);
}

export function initProjectImageScroll() {
	observer?.disconnect();
	observer = null;

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const frames = [...document.querySelectorAll<HTMLElement>('[data-project-image]')];

	if (!frames.length) return;

	if (reducedMotion) {
		frames.forEach(lockReveal);
		return;
	}

	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				playReveal(entry.target as HTMLElement);
				observer?.unobserve(entry.target);
			}
		},
		{ threshold: 0.08, rootMargin: '0px 0px 8% 0px' },
	);

	for (const frame of frames) {
		if (frame.classList.contains('is-revealed')) continue;
		observer.observe(frame);
	}
}

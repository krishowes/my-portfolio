/**
 * Default image paths for a work project collage.
 *
 * Drop files into `public/projects/{id}/` using these names:
 *   0-hero.jpg       — row 1, 4:3 hero (cols 1–8)
 *   1-portrait.jpg   — row 1, 3:4 portrait (cols 10–12)
 *   2-portrait.jpg   — row 2, 3:4 portrait (cols 1–3)
 *   3-portrait.jpg   — row 2, 3:4 portrait (cols 4–6)
 *   4-tall.jpg       — row 2, 9:16 tall (cols 9–12)
 *   5-landscape.jpg  — row 3, 4:3 landscape (cols 1–4)
 *   6-wide.jpg       — row 3, ~2:1 wide (cols 7–12)
 *   detail.jpg       — “More info” panel (X-mask + credits thumb)
 *
 * Any format works (.jpg, .png, .webp) — update the extension here if needed.
 */
const COLLAGE_FILES = [
	'0-hero.jpg',
	'1-portrait.jpg',
	'2-portrait.jpg',
	'3-portrait.jpg',
	'4-tall.jpg',
	'5-landscape.jpg',
	'6-wide.jpg',
] as const;

export function projectCollageImages(id: string): string[] {
	const base = `/projects/${id}`;
	return COLLAGE_FILES.map((file) => `${base}/${file}`);
}

export function projectDetailImage(id: string): string {
	return `/projects/${id}/detail.jpg`;
}

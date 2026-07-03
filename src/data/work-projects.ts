import { projectCollageImages, projectDetailImage } from './project-images';

export type ProjectTheme = 'dark' | 'paper' | 'yellow' | 'blue';

export interface ProjectCredit {
	role: string;
	name: string;
}

export interface ProjectModel {
	/** Set to false to hide the viewer and show collage slot 5 instead */
	enabled?: boolean;
	/** Path to the shaded .glb (required) */
	shadedSrc: string;
	/** Optional topology/wireframe .glb — enables the Shaded/Topology toggle */
	topoSrc?: string;
	/** Optional poster image; falls back to the slot image if omitted */
	poster?: string;
	alt?: string;
}

export interface WorkProject {
	id: string;
	/** Mini nav label (display order) */
	label: string;
	theme: ProjectTheme;
	titleLines: string[];
	overview: string;
	quote: string;
	author: string;
	brief: string;
	whatChanged: string;
	credits: ProjectCredit[];
	/** Seven collage slots — defaults to `public/projects/{id}/` paths */
	images: string[];
	/** “More info” panel hero image */
	detailImage: string;
	/** Optional interactive 3D model, rendered in collage slot 5 */
	model?: ProjectModel;
}

const defaultCredits: ProjectCredit[] = [
	{ role: 'Direction', name: 'Kris Howes' },
	{ role: 'Copywriting', name: 'Kris Howes' },
	{ role: 'Photography', name: 'Kris Howes' },
	{ role: 'Design', name: 'Kris Howes' },
	{ role: 'Build', name: 'Kris Howes' },
];

/** Starter copy — replace per project in the array below. */
function defaultProjectCopy(label: string) {
	return {
		overview: `Overview for ${label}. Edit this in src/data/work-projects.ts.`,
		quote: `Client feedback for ${label}.`,
		author: '—Client name',
		brief: `The brief for ${label}.`,
		whatChanged: `What changed on ${label}.`,
		credits: defaultCredits,
	};
}

function project(
	entry: Pick<WorkProject, 'id' | 'label' | 'theme' | 'titleLines'> &
		Partial<
			Pick<
				WorkProject,
				| 'overview'
				| 'quote'
				| 'author'
				| 'brief'
				| 'whatChanged'
				| 'credits'
				| 'images'
				| 'detailImage'
				| 'model'
			>
		>,
): WorkProject {
	const copy = defaultProjectCopy(entry.label);
	return {
		...copy,
		...entry,
		images: entry.images ?? projectCollageImages(entry.id),
		detailImage: entry.detailImage ?? projectDetailImage(entry.id),
	};
}

/** Order matches the Figma mini nav (top → bottom). */
export const workProjects: WorkProject[] = [
	project({
		id: 'primley-park',
		label: 'Primley Park',
		theme: 'dark',
		titleLines: ['Primley Park', '_All for a good cause'],
		quote: '“Kris turned a complex fundraising story into something people actually wanted to share.”',
		author: '—Sarah Whitfield',
		model: {
			enabled: false,
			shadedSrc: '/projects/primley-park/zegama.glb',
			poster: '/projects/primley-park/primley-poster.jpg',
			alt: 'Interactive 3D model for Primley Park',
		},
	}),
	project({
		id: 'fly',
		label: 'Fly',
		theme: 'paper',
		titleLines: ['Fly', '_All for a good cause'],
		quote: '“The work gave us a clarity and confidence we’d never had as a brand before.”',
		author: '—Daniel Okoye',
	}),
	project({
		id: 'g-l',
		label: 'G+L',
		theme: 'yellow',
		titleLines: ['G+L', '_All for a good cause'],
		quote: '“Every detail felt considered — it made us look far bigger than we are.”',
		author: '—Rebecca Lang',
	}),
	project({
		id: 'opus-4',
		label: 'Opus 4',
		theme: 'blue',
		titleLines: ['Opus 4', '_All for a good cause'],
		quote: '“Kris understood the ambition instantly and designed something that finally matched it.”',
		author: '—Marcus Feld',
	}),
	project({
		id: 'caaf',
		label: 'CAAF',
		theme: 'paper',
		titleLines: ['Chapel Allerton Arts Festival', '_All for a good cause'],
		overview:
			'Chapel Allerton Arts Festival is a brand identity and Webflow website project for a local arts and community festival, covering visual identity, print, brand guidelines and event promotion.',
		quote:
			'“Kris created a colourful, flexible identity and practical Webflow website that helped the festival present its events more clearly and consistently across digital and print.”',
		author: '—James Flegg',
		brief:
			'Chapel Allerton Arts Festival is a brand identity and Webflow website project for a local arts and community festival, covering visual identity, print, brand guidelines and event promotion.',
		whatChanged:
			'I developed a flexible visual system that could work across the website, social posts, posters and event listings. The site was designed to make the programme easy to browse, with a structure that could be updated as new events were added.',
	}),
	project({
		id: 'mapleleaf',
		label: 'Mapleleaf',
		theme: 'dark',
		titleLines: ['Mapleleaf', '_All for a good cause'],
		quote: '“He took a vague idea and shaped it into a brand we’re genuinely proud of.”',
		author: '—Hannah Reid',
	}),
	project({
		id: 'pack',
		label: 'Pack',
		theme: 'yellow',
		titleLines: ['Pack', '_All for a good cause'],
		quote: '“Fast, thoughtful and completely on-brief — the response from our audience said it all.”',
		author: '—Tom Bexley',
	}),
	project({
		id: 'shotgun',
		label: 'Shotgun',
		theme: 'blue',
		titleLines: ['Shotgun', '_All for a good cause'],
		quote: '“The identity gave the whole launch an energy we couldn’t have created ourselves.”',
		author: '—Priya Nair',
	}),
	project({
		id: 'spike',
		label: 'Spike',
		theme: 'paper',
		titleLines: ['Spike', '_All for a good cause'],
		quote: '“Kris made a technical product feel human, sharp and easy to love.”',
		author: '—Alex Turner',
	}),
	project({
		id: 'jla',
		label: 'JLA',
		theme: 'dark',
		titleLines: ['JLA', '_All for a good cause'],
		quote: '“Working with Kris felt less like hiring a supplier and more like gaining a teammate.”',
		author: '—Laura Simmons',
	}),
	project({
		id: 'firefly',
		label: 'Firefly',
		theme: 'yellow',
		titleLines: ['Firefly', '_All for a good cause'],
		quote: '“He delivered work that punched well above our budget and our timeline.”',
		author: '—Ben Carter',
	}),
];

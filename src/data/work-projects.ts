export type ProjectTheme = 'dark' | 'paper' | 'yellow' | 'blue';

export interface WorkProject {
	id: string;
	/** Mini nav label (display order) */
	label: string;
	theme: ProjectTheme;
	titleLines: string[];
	overview?: string;
}

/** Order matches the Figma mini nav (top → bottom). */
export const workProjects: WorkProject[] = [
	{
		id: 'primley-park',
		label: 'Primley Park',
		theme: 'dark',
		titleLines: ['Primley Park'],
	},
	{
		id: 'fly',
		label: 'Fly',
		theme: 'paper',
		titleLines: ['Fly'],
	},
	{
		id: 'g-l',
		label: 'G+L',
		theme: 'yellow',
		titleLines: ['G+L'],
	},
	{
		id: 'opus-4',
		label: 'Opus 4',
		theme: 'blue',
		titleLines: ['Opus 4'],
	},
	{
		id: 'caaf',
		label: 'CAAF',
		theme: 'paper',
		titleLines: ['Chapel Allerton Arts Festival', '_All for a good cause'],
		overview:
			'Chapel Allerton Arts Festival is a brand identity and Webflow website project for a local arts and community festival, covering visual identity, print, brand guidelines and event promotion.',
	},
	{
		id: 'mapleleaf',
		label: 'Mapleleaf',
		theme: 'dark',
		titleLines: ['Mapleleaf'],
	},
	{
		id: 'pack',
		label: 'Pack',
		theme: 'yellow',
		titleLines: ['Pack'],
	},
	{
		id: 'shotgun',
		label: 'Shotgun',
		theme: 'blue',
		titleLines: ['Shotgun'],
	},
	{
		id: 'spike',
		label: 'Spike',
		theme: 'paper',
		titleLines: ['Spike'],
	},
	{
		id: 'jla',
		label: 'JLA',
		theme: 'dark',
		titleLines: ['JLA'],
	},
	{
		id: 'firefly',
		label: 'Firefly',
		theme: 'yellow',
		titleLines: ['Firefly'],
	},
];

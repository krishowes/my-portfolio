import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * A scroll-driven 3D scene backed by a Blender export.
 *
 * The camera path (position/rotation, and anything else you keyframe) is
 * authored in Blender, exported as a .glb with its animation baked in, and
 * scrubbed here with a THREE.AnimationMixer as `setProgress()` is fed values
 * from 0 → 1 (e.g. from a GSAP ScrollTrigger `onUpdate`). Scrubbing means we
 * call `mixer.setTime()` directly rather than letting the clip play on its
 * own clock, so scroll position maps 1:1 onto a point in the animation.
 *
 * Re-export `public/models/hero.glb` from Blender (File > Export > glTF 2.0,
 * or the export script in the project notes) any time you change the camera
 * keyframes, geometry, or materials — nothing here needs to change to pick
 * up a new export, as long as the camera is still named "Camera" and still
 * has an action on it.
 *
 * Materials are baked, not live: each mesh's lighting/shadows/AO are baked to
 * a texture in Blender (Cycles, `COMBINED` bake) and wired into both the base
 * color and the emissive channel, so the shape reads correctly with zero
 * runtime lights — cheaper, and it lets Blender's path tracer do the soft-
 * shadow work a real-time light in the browser can't cheaply match. If you
 * move a light or object in Blender, you need to re-bake and re-export for
 * the shadow to update — it won't happen live.
 */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MODEL_URL = '/models/hero.glb';
// Damping half-life in seconds — how long it takes the camera to close half the
// gap to the target scroll position. Framerate-independent (see the delta-time
// lerp below), unlike a flat per-frame factor, which would settle faster on a
// 144Hz display than a 60Hz one.
const DAMPING_HALF_LIFE = 0.12;

export interface ScrollScene {
	/** Feed a 0–1 scroll progress value in (typically from ScrollTrigger's onUpdate). */
	setProgress: (progress: number) => void;
	/** Stop the render loop and free GPU resources. Call on cleanup/navigation. */
	destroy: () => void;
}

export function createScrollScene(canvas: HTMLCanvasElement): ScrollScene {
	const scene = new THREE.Scene();

	// Placeholder camera used until the .glb (and its real camera) finishes
	// loading, so resize/render never have to special-case "not ready yet".
	let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
	camera.position.set(0, -11.35, 3.6);
	camera.lookAt(0, 0, 1);

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	// --- lighting --------------------------------------------------------------
	// Deliberately none. Shadows/AO/lighting are baked into each mesh's texture
	// in Blender (see the emissive-texture note in the file header), so nothing
	// here needs a runtime light — one less thing computed every frame. If you
	// switch back to live materials later, re-add lights here.

	// --- resize --------------------------------------------------------------
	function resize() {
		const { clientWidth: width, clientHeight: height } = canvas;
		if (!width || !height) return;
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}

	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(canvas);
	resize();

	// --- scroll-driven camera scrub -------------------------------------------
	let targetProgress = 0;
	let currentProgress = 0;
	let mixer: THREE.AnimationMixer | null = null;
	let clipDuration = 0;
	let loadedRoot: THREE.Object3D | null = null;

	// --- load the Blender export ----------------------------------------------
	let destroyed = false;
	const loader = new GLTFLoader();
	loader.load(
		MODEL_URL,
		(gltf) => {
			if (destroyed) return;

			loadedRoot = gltf.scene;
			scene.add(gltf.scene);

			// Prefer a camera actually named "Camera" (Blender's default name);
			// fall back to whatever camera the export contains.
			const loadedCamera =
				gltf.cameras.find((c) => c.name === 'Camera') ?? gltf.cameras[0];

			if (loadedCamera instanceof THREE.PerspectiveCamera) {
				loadedCamera.aspect = camera.aspect;
				loadedCamera.updateProjectionMatrix();
				camera = loadedCamera;
			} else {
				console.warn('[scene3d] No camera found in', MODEL_URL, '— keeping placeholder.');
			}

			// Find the clip that animates the camera (by name, exported from the
			// Blender action) so unrelated object animations don't get scrubbed
			// along with it.
			const cameraClip =
				gltf.animations.find((clip) => clip.name.toLowerCase().includes('camera')) ??
				gltf.animations[0];

			if (cameraClip && loadedCamera) {
				mixer = new THREE.AnimationMixer(loadedCamera);
				const action = mixer.clipAction(cameraClip);
				// Deliberately left playing (not paused): three.js implements
				// `paused` as a zero time-scale, which would stop `mixer.setTime()`
				// from ever advancing the clip. We fully control time via
				// `setTime()` every frame below, so playback never runs on its own.
				action.play();
				clipDuration = cameraClip.duration;
				mixer.setTime(currentProgress * clipDuration);
			} else {
				console.warn('[scene3d] No camera animation found in', MODEL_URL);
			}
		},
		undefined,
		(error) => {
			console.error('[scene3d] Failed to load', MODEL_URL, error);
		},
	);

	// --- render loop -----------------------------------------------------------
	let frameId = 0;
	// THREE.Clock is deprecated as of three r181 (aligning with the
	// requestAnimationFrame timestamp instead) — track delta manually.
	let lastTime = performance.now();

	function tick() {
		if (destroyed) return;

		const now = performance.now();
		const delta = (now - lastTime) / 1000;
		lastTime = now;

		if (REDUCED_MOTION) {
			currentProgress = targetProgress;
		} else {
			// Exponential decay toward the target, framerate-independent: the
			// fraction of the remaining gap closed this frame depends on how much
			// time actually passed, not on how many frames that took.
			const decay = 1 - Math.pow(0.5, delta / DAMPING_HALF_LIFE);
			currentProgress += (targetProgress - currentProgress) * decay;
		}

		if (mixer && clipDuration > 0) {
			mixer.setTime(currentProgress * clipDuration);
		}

		renderer.render(scene, camera);
		frameId = requestAnimationFrame(tick);
	}
	frameId = requestAnimationFrame(tick);

	return {
		setProgress(progress: number) {
			targetProgress = THREE.MathUtils.clamp(progress, 0, 1);
		},
		destroy() {
			destroyed = true;
			cancelAnimationFrame(frameId);
			resizeObserver.disconnect();

			mixer?.stopAllAction();
			if (loadedRoot) {
				mixer?.uncacheRoot(loadedRoot);
				loadedRoot.traverse((obj) => {
					const mesh = obj as THREE.Mesh;
					if (!mesh.isMesh) return;
					mesh.geometry?.dispose();
					const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
					for (const material of materials) {
						for (const key of ['map', 'emissiveMap', 'roughnessMap', 'metalnessMap', 'normalMap', 'aoMap'] as const) {
							(material as any)[key]?.dispose?.();
						}
						material.dispose();
					}
				});
			}

			renderer.dispose();
		},
	};
}

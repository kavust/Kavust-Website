import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import type * as THREE from 'three';

// Shared loader promise: both Dubai roles use the same local asset and GPU resources.
let modelPromise: Promise<THREE.Group> | undefined;
export default function BurjIcon() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const canvas = ref.current!;
    let disposed = false, visible = false, frame = 0, last = 0;
    let renderer: THREE.WebGLRenderer | undefined;
    let scene: THREE.Scene, camera: THREE.OrthographicCamera, pivot: THREE.Group;
    let loading = false;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function tick(now: number) {
      frame = 0;
      if (disposed || !visible || document.hidden || !renderer) return;
      if (!last || now - last >= 1000 / 24) {
        const dt = last ? Math.min((now - last) / 1000, .1) : 0;
        last = now;
        if (!reduced.matches) pivot.rotation.y += dt * Math.PI * 2 / 40;
        renderer.render(scene, camera);
      }
      if (!reduced.matches) frame = requestAnimationFrame(tick);
    }
    function resume() {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      if (visible && !document.hidden && renderer && !disposed) frame = requestAnimationFrame(tick);
    }
    async function load() {
      if (loading || renderer || disposed) return;
      loading = true;
      try {
        const T = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        modelPromise ??= new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}models/burj-khalifa.gltf`).then(g => g.scene).catch(error => { modelPromise = undefined; throw error; });
        const original = await modelPromise;
        if (disposed) return;
        scene = new T.Scene();
        pivot = new T.Group();
        const model = original.clone(true);
        // Keep original geometry, materials and textures. Normalize framing only.
        model.updateMatrixWorld(true);
        const box = new T.Box3().setFromObject(model);
        const center = box.getCenter(new T.Vector3());
        const size = box.getSize(new T.Vector3());
        model.position.sub(center);
        const normalized = new T.Group(); normalized.add(model);
        normalized.scale.setScalar(2 / Math.max(size.y, .001));
        pivot.add(normalized); pivot.rotation.y = .5;
        scene.add(pivot);
        scene.add(new T.HemisphereLight(0xffffff, 0x747c89, 2.5));
        const key = new T.DirectionalLight(0xfff5e5, 3); key.position.set(3, 5, 5); scene.add(key);
        const fill = new T.DirectionalLight(0xc6ddff, 2); fill.position.set(-3, 2, -3); scene.add(fill);
        const aspect = 30 / 44;
        camera = new T.OrthographicCamera(-1.15 * aspect, 1.15 * aspect, 1.15, -1.15, .1, 20);
        camera.position.set(0, .18, 5); camera.lookAt(0, 0, 0);
        renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
        renderer.setSize(30, 44, false);
        renderer.setClearColor(0, 0);
        renderer.render(scene, camera);
        setReady(true); resume();
      } catch { renderer?.dispose(); renderer = undefined; }
      finally { loading = false; }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) void load();
      resume();
    });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', resume);
    reduced.addEventListener('change', resume);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      document.removeEventListener('visibilitychange', resume);
      reduced.removeEventListener('change', resume);
      renderer?.dispose();
    };
  }, []);
  return <span aria-hidden="true" className="relative inline-flex shrink-0 items-center justify-center pointer-events-none" style={{ width: 30, height: 44 }}>
    {!ready && <MapPin className="absolute w-3.5 h-3.5" />}
    <canvas ref={ref} width={60} height={88} style={{ width: 30, height: 44, opacity: ready ? 1 : 0 }} />
  </span>;
}

import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const runtime = readFileSync(new URL('../public/silk-runtime.js', import.meta.url), 'utf8');
test('pinch stays local instead of translating the whole membrane', () => {
  const width = Number(runtime.match(/float influence=exp\(-dot\(offset,offset\)\/([.\d]+)\)/)[1]);
  assert.equal(Math.exp(0), 1);
  assert.ok(Math.exp(-.5 * .5 / width) < .001);
  assert.match(runtime, /pull\*cos\(phase\)\+inertia\*sin\(phase\)/);
  assert.match(runtime, /mv.z\+=loosen\*ring/);
});
test('finish transitions into an independently flowing translucent sphere while DNA remains separate', () => {
  assert.match(runtime, /finishTarget=i===2\?1:0/);
  assert.match(runtime, /vec3 referenceMembrane\(vec3 n,float clock,float sheet\)/);
  assert.match(runtime, /float rate=sheet<\.5\?\.34:\(sheet<1\.5\?\-\.27:\.2\)/);
  assert.match(runtime, /turn=clock\*\.09/);
  assert.match(runtime, /p=mix\(p,helix,dna\)/);
  assert.match(runtime, /if\(finish>\.0001\)p=mix\(p,referenceMembrane\(n,referenceTime,layer\),finish\)/);
  assert.match(runtime, /u\.finish\.value\+=/);
});
test('reference clock is independent of country tempo and glow is finish-only', () => {
  assert.match(runtime, /uniforms\.referenceTime\.value=time;/);
  assert.match(runtime, /if\(finishAmount>\.001\)/);
  assert.match(runtime, /else renderer\.render\(scene,camera\)/);
  assert.match(runtime, /mesh\.geometry=layerUniforms\[i\]\.finish\.value>\.001\?referenceGeometry:mesh\.userData\.baseGeometry/);
  const deformation=runtime.slice(runtime.indexOf('vec3 referenceMembrane'),runtime.indexOf('void main(){vec3 n='));
  assert.doesNotMatch(deformation, /mod\(|floor\(clock|%/);
});
const spring = runInNewContext(`(${runtime.slice(runtime.indexOf('function springStep'), runtime.indexOf('\ntry {'))})`);
for (const fps of [30, 60, 120]) {
  test(`released layer overshoots and settles over six seconds at ${fps} FPS`, () => {
    const value = { x: 1, y: -.5 }, velocity = { x: 0, y: 0 };
    let opposite = 0, lateMotion = 0;
    for (let frame = 0; frame < fps * 6; frame++) {
      spring(value, velocity, { x: 0, y: 0 }, false, 1 / fps);
      opposite = Math.min(opposite, value.x);
      if (frame > fps * 3 && frame < fps * 4) lateMotion = Math.max(lateMotion, Math.abs(value.x));
    }
    assert.ok(opposite < -.45, 'must swing visibly past its original position');
    assert.ok(lateMotion > .025, 'must not snap to rest early');
    assert.ok(Math.hypot(value.x, value.y, velocity.x / Math.sqrt(14), velocity.y / Math.sqrt(14)) < .015, 'must settle by six seconds');
  });
}
const handlers = runtime.slice(runtime.indexOf('const contacts=new Map()'), runtime.indexOf("const button=root.querySelector('#pause');"));
function setup() {
  const listeners = {};
  const capture = new Set();
  let splashes = 0;
  const vector = () => ({ x: 0, y: 0, copy(p) { this.x = p.x; this.y = p.y; return this; }, sub(p) { this.x -= p.x; this.y -= p.y; return this; }, length() { return Math.hypot(this.x, this.y); }, multiplyScalar(n) { this.x *= n; this.y *= n; return this; }, set(x, y) { this.x = x; this.y = y; return this; } });
  const drag = { id: null, start: vector(), target: vector(), layer: null };
  const canvas = { style:{}, addEventListener: (type, callback) => { listeners[type] = callback; }, setPointerCapture: id => capture.add(id), hasPointerCapture: id => capture.has(id), releasePointerCapture: id => capture.delete(id) };
  const pointer = e => ({ world: vector().set(e.clientX / 100, e.clientY / 100) });
  const context={canvas,drag,pointer,targetYaw:0,targetPitch:.06,targetDistance:5.5,activeLayer:0,THREE:{MathUtils:{clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}},splash:()=>splashes++,beginPull:e=>{drag.mode='pull';drag.layer='silk';drag.start.copy(pointer(e).world);}};
  runInNewContext(handlers,context);
  const emit = (type, x, y,id=1) => listeners[type]({ type, pointerId:id, pointerType: 'touch', clientX: x, clientY: y });
  return { drag, capture, emit,context, splashes: () => splashes };
}
test('vertical touch deforms the layer and captures within the canvas', () => {
  const t = setup(); t.emit('pointerdown', 0, 0); t.emit('pointermove', 1, 30);
  assert.equal(t.drag.id, 1); assert.equal(t.capture.size, 1); assert.ok(t.drag.target.y>0);
  assert.equal(t.splashes(), 0);
});
test('horizontal touch pulls, then preserves the spring return on release', () => {
  const t = setup(); t.emit('pointerdown', 0, 0); t.emit('pointermove', 30, 1);
  assert.equal(t.capture.size, 1); assert.ok(t.drag.target.x > 0);
  t.emit('pointerup', 30, 1);
  assert.equal(t.drag.id, null); assert.equal(t.drag.layer, 'silk'); assert.equal(t.drag.target.length(), 0);
});
test('native scroll cancellation does not create a splash', () => {
  const t = setup(); t.emit('pointerdown', 0, 0); t.emit('pointercancel', 0, 20);
  assert.equal(t.drag.id, null); assert.equal(t.splashes(), 0);
});
test('integration has no iframe or synthetic page scrolling', () => {
  const html = readFileSync(new URL('../public/silk-atlas.html', import.meta.url), 'utf8');
  const mount = readFileSync(new URL('../src/wine-atlas/sensory.js', import.meta.url), 'utf8');
  assert.match(html, /touch-action:pan-y pinch-zoom/);
  assert.doesNotMatch(mount, /createElement\('iframe'\)/);
  assert.doesNotMatch(runtime, /scrollBy/);
  assert.match(runtime,/canvas.style.touchAction='none'/);
});
test('empty space orbits both axes without pulling',()=>{
 const t=setup();t.emit('pointerdown',140,0);t.emit('pointermove',160,30);
 assert.equal(t.drag.mode,'orbit');assert.ok(t.context.targetYaw<0);assert.ok(t.context.targetPitch>.06);assert.equal(t.drag.target.length(),0);
});
test('pinch enters sphere and resumes orbit after one finger releases',()=>{
 const t=setup();t.emit('pointerdown',0,0);t.emit('pointerdown',10,0,2);t.emit('pointermove',1000,0,2);
 assert.equal(t.context.targetDistance,.22);assert.equal(t.drag.target.length(),0);
 t.emit('pointerup',1000,0,2);assert.equal(t.drag.mode,'orbit');t.emit('pointerup',0,0);assert.equal(t.drag.id,null);
});

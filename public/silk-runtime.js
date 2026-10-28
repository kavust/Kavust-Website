
export async function initSilk(root) {
let english=false,region='',activeLayer=0,motionFactor=1,cameraTarget=null,targetYaw=0,targetPitch=.06,targetDistance=5.5;
const descriptions={
 'Bordeaux':[['Siyah meyve ve baharat çağrışımları.','Yapılı, tanenli kırmızı stil.','Uzun ve katmanlı bitiş.'],['Dark fruit and spice notes.','Structured, tannic red style.','Long, layered finish.']],
 'Champagne':[['Narenciye ve beyaz meyve çağrışımları.','Canlı asidite ve ince kabarcıklar.','Ferah, temiz bitiş.'],['Citrus and white-fruit notes.','Lively acidity and fine bubbles.','Fresh, clean finish.']],
 'Napa Valley':[['Olgun siyah meyve çağrışımları.','Cabernet için dolgun, yapılı stil.','Yoğun meyveli bitiş.'],['Ripe dark-fruit notes.','A full, structured Cabernet style.','A concentrated fruit-led finish.']],
 'Ege':[['Bornova Misketi için çiçek ve narenciye çağrışımları.','Stile göre hafiften dolguna değişen doku.','Üzüm ve üretim stiline göre değişen bitiş.'],['Floral and citrus notes in Bornova Misketi.','Texture ranges from light to full depending on style.','Finish varies with grape and winemaking style.']]
};
function showLayer(i){activeLayer=i;root.dataset.layer=String(i);if(cameraTarget){targetDistance=i===1?.58:5.5;targetYaw=i===2?Math.PI:0;targetPitch=i===2?.2:.06;}root.querySelectorAll('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.layer===i)));const fallback=english?['Aromas depend on grape variety and winemaking.','Body, acidity and tannin shape the texture.','The flavours and sensations that remain after a sip.']:['Aromalar üzüm çeşidi ve üretim yöntemiyle şekillenir.','Gövde, asidite ve tanen dokuyu belirler.','Bir yudumdan sonra kalan tatlar ve duyumlar.'];root.querySelector('#layer-description').textContent=descriptions[region]?.[english?1:0][i]||fallback[i];}
root.querySelectorAll('[data-layer]').forEach(b=>b.onclick=()=>showLayer(+b.dataset.layer));showLayer(0);
root.addEventListener('wine-sensory',event=>{const e={data:event.detail};english=!!e.data.en;region=String(e.data.name||'');motionFactor=({'Bordeaux':.8,'Champagne':1.4,'Napa Valley':1.05,'Ege':1.2})[region]||1;root.querySelector('#region-name').textContent=region+' · '+(english?'Wine layers':'Şarabın katmanları');root.querySelector('#sensory-grapes').textContent=Array.isArray(e.data.grapes)?e.data.grapes.join(' · '):'';root.querySelectorAll('[data-layer]').forEach((b,i)=>b.textContent=(english?['Aroma','Texture','Finish']:['Aroma','Doku','Bitiş'])[i]);root.querySelector('#sensory-disclaimer').textContent=english?'Illustrative style · Varies by producer and vintage.':'Temsili stil · Üretici ve rekolteye göre değişir.';showLayer(activeLayer);});
// Low release damping gives three weightless swings and a roughly six-second decay.
function springStep(value,velocity,target,held,dt){
 const steps=Math.ceil(dt/.008),h=dt/steps,k=held?145:14,damping=held?22:1.65;
 for(let i=0;i<steps;i++){velocity.x+=((target.x-value.x)*k-velocity.x*damping)*h;velocity.y+=((target.y-value.y)*k-velocity.y*damping)*h;value.x+=velocity.x*h;value.y+=velocity.y*h;}
}
try {
const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js');
const canvas=root.querySelector('canvas'),stage=root.querySelector('.orb-stage');
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'low-power'});
const coarsePointer=matchMedia('(pointer:coarse)').matches;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.02,30);camera.position.z=5.5;cameraTarget=new THREE.Vector3(0,0,5.5);
showLayer(activeLayer);
const group=new THREE.Group();scene.add(group);
const vertex=`uniform float time;uniform float layer;uniform float pixelRatio;uniform float focus;uniform vec2 grab;uniform vec2 pull;uniform vec4 drops[4];attribute float seed;varying float brightness;
void main(){vec3 n=normalize(position);float theta=atan(n.z,n.x);float phi=acos(clamp(n.y,-1.,1.));
float speed=layer<.5?1.25:(layer<1.5?-2.3:1.75);
float verticalSpeed=layer<.5?.38:(layer<1.5?-.78:1.08);
float verticalAmplitude=layer<.5?.035:(layer<1.5?.115:.06);
float flow=time*speed;
float wave=sin(theta*3.+phi*4.+flow*.43+layer*2.1)*.035+sin(theta*5.-phi*3.-flow*.31+layer)*.022;
float fold=pow(.5+.5*sin(phi*6.+theta*2.+flow*.36+layer*1.9),3.5);
// Tangential drift moves the inner fabric without shifting the sphere's centre.
float drift=sin(flow*.47+layer*2.3)*.18;
float ripple=sin(phi*2.5+time*verticalSpeed+layer*1.7)*.055;
float silkTheta=theta+(drift+ripple)*sin(phi);
float silkPhi=phi+sin(time*verticalSpeed+theta*2.+layer)*verticalAmplitude*sin(phi);
vec3 silk=vec3(sin(silkPhi)*cos(silkTheta),cos(silkPhi),sin(silkPhi)*sin(silkTheta));
vec3 p=silk*(1.+wave+fold*.055-layer*.014);p.x+=sin(phi*3.+flow*.19+layer)*.02;
vec4 mv=modelViewMatrix*vec4(p,1.);
vec2 offset=mv.xy-grab;
float influence=exp(-dot(offset,offset)/(.5+length(pull)*.36));
mv.xy+=pull*influence;
mv.z+=sin(length(offset)*4.)*length(pull)*influence*.12;
for(int i=0;i<4;i++){
 float age=drops[i].z,dist=length(mv.xy-drops[i].xy);
 float front=dist-age*.82;
 float envelope=exp(-age*.8)/sqrt(1.+age*2.)*smoothstep(0.,.11,age);
 float packet=sin(front*10.)*exp(-front*front*2.4)+.22*sin(front*17.-.65)*exp(-front*front*4.5);
 float pulse=packet*envelope*drops[i].w;
 mv.xy+=(mv.xy-drops[i].xy)/max(dist,.03)*pulse*.055;
 mv.z+=pulse*.08;
}
gl_Position=projectionMatrix*mv;
gl_PointSize=clamp((.9+fold*.35)*(1.+focus*.42)*pixelRatio*(4.8/max(.02,-mv.z)),.5,3.5*pixelRatio);
brightness=(.055+fold*.34)*(.48+.52*abs(n.z))*(1.+focus*.5);}`;
const fragment=`uniform vec3 tint;varying float brightness;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.12,d);gl_FragColor=vec4(tint,a*brightness);}`;
const layers=[];
const drops=Array.from({length:4},()=>new THREE.Vector4(0,0,10,0));let nextDrop=0;
function splash(p){drops[nextDrop].set(p.x,p.y,0,reduced?0:1);nextDrop=(nextDrop+1)%drops.length;}
const membraneVertex=vertex
 .replace('varying float brightness;', 'varying float brightness;varying vec3 viewPosition;')
 .replace('vec3 p=silk*(1.+wave+fold*.055-layer*.014);', 'float curl=sin(theta*2.+phi*3.+flow*.43+layer*1.7+sin(phi*2.-flow*.31)*.7);vec3 p=silk*(.89+wave*.65+curl*.095+sin(theta*4.-phi*2.-flow*.27+layer)*.025+fold*.045-layer*.009);')
 .replace('gl_Position=projectionMatrix*mv;', 'viewPosition=mv.xyz;gl_Position=projectionMatrix*mv;');
const membraneFragment=`uniform vec3 tint;uniform float focus;varying vec3 viewPosition;varying float brightness;
void main(){
 vec3 normal=normalize(cross(dFdx(viewPosition),dFdy(viewPosition)));
 float rim=pow(1.-abs(dot(normal,normalize(-viewPosition))),2.8);
 float alpha=.003+rim*(.13+focus*.055);
 gl_FragColor=vec4(tint,alpha);
}`;
const layerUniforms=[];
for(let l=0;l<3;l++){
 const rows=170,cols=280,positions=new Float32Array(rows*cols*3),seeds=new Float32Array(rows*cols);
 let k=0;
 for(let r=0;r<rows;r++){const phi=Math.acos(1.-2.*(r+.5)/rows);for(let c=0;c<cols;c++){const theta=(c+.35*Math.sin(k*12.9898))/cols*Math.PI*2;positions[k*3]=Math.sin(phi)*Math.cos(theta);positions[k*3+1]=Math.cos(phi);positions[k*3+2]=Math.sin(phi)*Math.sin(theta);seeds[k]=k;k++;}}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('seed',new THREE.BufferAttribute(seeds,1));
 const uniforms={drops:{value:drops},time:{value:0},layer:{value:l},focus:{value:l===0?1:0},grab:{value:new THREE.Vector2()},pull:{value:new THREE.Vector2()},pixelRatio:{value:renderer.getPixelRatio()},tint:{value:new THREE.Color(['#829deb','#adbaff','#6d8cd5'][l])}};layerUniforms.push(uniforms);
 const material=new THREE.ShaderMaterial({uniforms,vertexShader:membraneVertex,fragmentShader:membraneFragment,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
 const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,128,96),material);
 const dustMaterial=new THREE.ShaderMaterial({uniforms,vertexShader:membraneVertex,fragmentShader:fragment.replace('a*brightness','a*brightness*.12'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
 mesh.add(new THREE.Points(geometry,dustMaterial));
 mesh.rotation.set(l*.64,l*.92,l*.38);group.add(mesh);layers.push(mesh);
}
const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(stage);resize();
let visible=true,paused=false,last=0,time=0,x=0,y=0,tx=0,ty=0;
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(stage);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;paused=reduced;
const drag={id:null,layer:null,mode:'',pointerType:'',start:new THREE.Vector2(),target:new THREE.Vector2(),value:new THREE.Vector2(),velocity:new THREE.Vector2(),clientX:0,clientY:0,lastY:0};

function pointer(e){const b=canvas.getBoundingClientRect();const ndc=new THREE.Vector2((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2),distance=camera.position.length();return {ndc,world:new THREE.Vector2(ndc.x*camera.aspect*distance*Math.tan(Math.PI/10),ndc.y*distance*Math.tan(Math.PI/10))};}
function beginPull(e){const p=pointer(e);drag.mode='pull';drag.layer=layers[activeLayer];drag.start.copy(p.world);layers.forEach(m=>m.material.uniforms.grab.value.copy(p.world));splash(p.world);}
// Vertical touch gestures remain native page scrolling, including momentum.
canvas.addEventListener('pointerdown',e=>{
 if(drag.id!==null || pointer(e).world.length()>1.2)return;
 drag.id=e.pointerId;drag.pointerType=e.pointerType;
 drag.clientX=e.clientX;drag.clientY=e.clientY;
 drag.mode=e.pointerType==='touch'?'pending':'pull';
 if(drag.mode==='pull'){beginPull(e);canvas.setPointerCapture(e.pointerId);}
});
canvas.addEventListener('pointermove',e=>{
 if(e.pointerId!==drag.id)return;
 if(drag.mode==='pending'){
  const dx=e.clientX-drag.clientX,dy=e.clientY-drag.clientY;
  if(Math.hypot(dx,dy)<8)return;
  if(Math.abs(dy)>=Math.abs(dx)){release(e);return;}
  beginPull({clientX:drag.clientX,clientY:drag.clientY});
  canvas.setPointerCapture(e.pointerId);
 }
 drag.target.copy(pointer(e).world).sub(drag.start);
 const length=drag.target.length();
 if(length>0)drag.target.multiplyScalar(2.6*Math.tanh(length/2.6)/length);
});
function release(e){
 if(e.pointerId!==drag.id)return;
 if(e.type==='pointerup'&&drag.mode==='pending')splash(pointer(e).world);
 drag.id=null;drag.mode='';drag.target.set(0,0);
 if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
}
canvas.addEventListener('pointerup',release);
canvas.addEventListener('pointercancel',release);
canvas.addEventListener('lostpointercapture',release);
const button=root.querySelector('#pause');const updateButton=()=>{button.textContent=paused?'▷':'Ⅱ';button.setAttribute('aria-label',paused?'Animasyonu oynat':'Animasyonu duraklat');};updateButton();button.onclick=()=>{paused=!paused;updateButton();};
function frame(now){if(!root.isConnected)return;requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.04);last=now;if(!visible||document.hidden)return;if(!paused)time+=dt;
 // A damped spring only deforms the grabbed layer; the scene's centre stays fixed.
 drops.forEach(d=>d.z=Math.min(10,d.z+dt));
 const ease=1-Math.exp(-dt*8.5);const yawNow=Math.atan2(camera.position.x,camera.position.z);let yawDelta=targetYaw-yawNow;if(yawDelta>Math.PI)yawDelta-=Math.PI*2;if(yawDelta< -Math.PI)yawDelta+=Math.PI*2;const yaw=yawNow+yawDelta*ease;const pitchNow=Math.asin(THREE.MathUtils.clamp(camera.position.y/camera.position.length(),-1,1));const pitch=pitchNow+(targetPitch-pitchNow)*ease;const distance=camera.position.length()+(targetDistance-camera.position.length())*ease;camera.position.set(Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance);camera.lookAt(0,0,0);
 layerUniforms.forEach((u,i)=>u.focus.value+=(Number(i===activeLayer)-u.focus.value)*ease);
 if(drag.layer){springStep(drag.value,drag.velocity,drag.target,drag.id!==null,dt);layers.forEach((m,i)=>m.material.uniforms.pull.value.copy(drag.value).multiplyScalar(m===drag.layer?1:.18+i*.06));}
 layers.forEach((mesh,i)=>{
  mesh.material.uniforms.time.value=time*motionFactor;
  mesh.rotation.set(i*.64+Math.sin(time*[.09,.17,.12][i]+i)*.025,i*.92+Math.sin(time*[.12,.08,.15][i]+i)*.035,i*.38+Math.sin(time*[.07,.13,.1][i]+i)*.02);
 });renderer.render(scene,camera);
}requestAnimationFrame(frame);
}catch(error){
 const old=root.querySelector('canvas'),canvas=old.cloneNode();old.replaceWith(canvas);
 const ctx=canvas.getContext('2d'),stage=root.querySelector('.orb-stage');
 let w=0,h=0,t=0,last=0,visible=true,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const resize=()=>{w=stage.clientWidth;h=stage.clientHeight;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);};new ResizeObserver(resize).observe(stage);resize();
 new IntersectionObserver(e=>{visible=e[0].isIntersecting;}).observe(stage);
 const button=root.querySelector('#pause');button.textContent=paused?'▷':'Ⅱ';button.onclick=()=>{paused=!paused;button.textContent=paused?'▷':'Ⅱ';button.setAttribute('aria-label',paused?'Animasyonu oynat':'Animasyonu duraklat');};
 const matchReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const touch={id:null,layer:-1,mode:'',pointerType:'',sx:0,sy:0,cy:0,lastY:0,ax:0,ay:0,tx:0,ty:0,x:0,y:0,vx:0,vy:0};
 let hitPoints=[];const splashes=[];
 const local=e=>{const b=canvas.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top];};
 canvas.addEventListener('pointerdown',e=>{
  if(touch.id!==null)return;
  const [x,y]=local(e),radius=Math.min(w*.27,h*.29);
  if(Math.hypot(x-w/2,y-h/2)>radius*1.2)return;
  Object.assign(touch,{id:e.pointerId,pointerType:e.pointerType,mode:e.pointerType==='touch'?'pending':'pull',layer:activeLayer,sx:e.clientX,sy:e.clientY,ax:x,ay:y,tx:0,ty:0});
  if(e.pointerType!=='touch')canvas.setPointerCapture(e.pointerId);
 });
 canvas.addEventListener('pointermove',e=>{
  if(e.pointerId!==touch.id)return;
  if(touch.mode==='pending'){
   const dx=e.clientX-touch.sx,dy=e.clientY-touch.sy;
   if(Math.hypot(dx,dy)<8)return;
   if(Math.abs(dy)>=Math.abs(dx)){release(e);return;}
   touch.mode='pull';canvas.setPointerCapture(e.pointerId);
  }
  const [x,y]=local(e),dx=x-touch.ax,dy=y-touch.ay,len=Math.hypot(dx,dy),limit=Math.min(w,h)*.65,f=len?limit*Math.tanh(len/limit)/len:1;
  touch.tx=dx*f;touch.ty=dy*f;
 });
 const release=e=>{
  if(e.pointerId!==touch.id)return;
  if(e.type==='pointerup'&&touch.mode==='pending'){const [x,y]=local(e);splashes.push({x,y,age:0});if(splashes.length>4)splashes.shift();}
  touch.id=null;touch.mode='';touch.tx=touch.ty=0;
  if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
 };
 canvas.addEventListener('pointerup',release);
 canvas.addEventListener('pointercancel',release);
 canvas.addEventListener('lostpointercapture',release);
 const points=[];for(let l=0;l<3;l++)for(let r=1;r<78;r++)for(let c=0;c<140;c++)points.push([r/78*Math.PI,c/140*Math.PI*2,l]);
 function frame(now){if(!root.isConnected)return;requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.04);last=now;if(!visible||document.hidden)return;if(!paused)t+=dt;ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';const size=Math.min(w*.27,h*.29);
 const value={x:touch.x,y:touch.y},velocity={x:touch.vx,y:touch.vy};springStep(value,velocity,{x:touch.tx,y:touch.ty},touch.id!==null,dt);Object.assign(touch,{x:value.x,y:value.y,vx:velocity.x,vy:velocity.y});splashes.forEach(d=>d.age+=dt);hitPoints=[];
 for(const [baseP,q,l] of points){const speeds=[1.25,-2.3,1.75],verticalSpeeds=[.38,-.78,1.08],flow=t*motionFactor*speeds[l],verticalSpeed=verticalSpeeds[l];const p=baseP+Math.sin(t*verticalSpeed+q*2+l)*[.035,.115,.06][l]*Math.sin(baseP);const drift=(Math.sin(flow*.47+l*2.3)*.18+Math.sin(baseP*2.5+t*verticalSpeed+l*1.7)*.055)*Math.sin(baseP);const a=q+t*(.045+l*.01)+drift,fold=Math.pow(.5+.5*Math.sin(baseP*6+q*2+flow*.36+l*1.9),3.5),rad=1+Math.sin(q*3+baseP*4+flow*.43+l*2.1)*.035+Math.sin(q*5-baseP*3-flow*.31+l)*.022+fold*.055-l*.014;
 let x=Math.sin(p)*Math.cos(a)*rad,y=Math.cos(p)*rad,z=Math.sin(p)*Math.sin(a)*rad;const tilt=l*.65+.3;const yy=y*Math.cos(tilt)-z*Math.sin(tilt);z=y*Math.sin(tilt)+z*Math.cos(tilt);y=yy;const angle=l*.65+Math.sin(t*[.09,.17,.12][l]+l)*.025+t*[.02,-.03,.018][l];const xx=x*Math.cos(angle)-y*Math.sin(angle);y=x*Math.sin(angle)+y*Math.cos(angle);x=xx;const perspective=3.8/(3.8-z);let sx=w/2+x*size*perspective,sy=h/2+y*size*perspective;
 if(touch.layer>=0){const weight=Math.exp(-((sx-touch.ax)**2+(sy-touch.ay)**2)/(size*size*(.5+Math.hypot(touch.x,touch.y)/size*.36))),strength=l===touch.layer?1:.18+l*.06;sx+=touch.x*weight*strength;sy+=touch.y*weight*strength;}if(!matchReduced){for(const drop of splashes){const dx=sx-drop.x,dy=sy-drop.y,dist=Math.hypot(dx,dy)/size,front=dist-drop.age*.82,envelope=Math.exp(-drop.age*.8)/Math.sqrt(1+drop.age*2)*Math.min(1,drop.age/.11),pulse=(Math.sin(front*10)*Math.exp(-front*front*2.4)+.22*Math.sin(front*17-.65)*Math.exp(-front*front*4.5))*envelope;sx+=dx/Math.max(dist,.03)*pulse*.055;sy+=dy/Math.max(dist,.03)*pulse*.055;}}hitPoints.push([sx,sy,l]);if(q===0){ctx.beginPath();ctx.moveTo(sx,sy);}else ctx.lineTo(sx,sy);if(q>6.23){ctx.strokeStyle='rgba(143,169,245,.025)';ctx.lineWidth=.55;ctx.stroke();}ctx.fillStyle='rgba(143,169,245,'+((.012+fold*.13)*(.6+.4*(z+1)/2))+')';ctx.fillRect(sx,sy,.55*perspective,.55*perspective);}}
 requestAnimationFrame(frame);
}
}


import { useEffect, useRef } from 'react';

type Kind = 'izmir' | 'dubai' | 'usa';
type V = [number, number, number];
type Colour = [number, number, number];
const stone: Colour = [.79, .68, .47];
const pale: Colour = [.93, .84, .65];
const copper: Colour = [.30, .66, .54];
const silver: Colour = [.64, .79, .86];
const dark: Colour = [.20, .28, .28];
const meshes = new Map<Kind, Float32Array>();

// Small, original geometric landmark models. No iframe, images, network or 3D runtime.
function geometry(kind: Kind): Float32Array {
  const cached = meshes.get(kind);
  if (cached) return cached;
  const vertices: number[] = [];
  function tri(a: V, b: V, c: V, colour: Colour) {
    const u = b.map((v, i) => v - a[i]), v = c.map((x, i) => x - a[i]);
    const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
    const length = Math.hypot(...n) || 1;
    for (const p of [a, b, c]) vertices.push(...p, ...n.map(x => x / length), ...colour);
  }
  function box(x: number, y: number, z: number, w: number, h: number, d: number, colour: Colour) {
    const pts: V[] = [];
    for (const [a,b,c] of [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]) pts.push([x+a*w/2,y+b*h/2,z+c*d/2]);
    for (const [a,b,c,d] of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]]) { tri(pts[a],pts[b],pts[c],colour);tri(pts[a],pts[c],pts[d],colour); }
  }
  function cone(x: number, y: number, z: number, bottom: number, top: number, height: number, colour: Colour, sides=12) {
    for(let i=0;i<sides;i++) {
      const a=i*Math.PI*2/sides,b=(i+1)*Math.PI*2/sides;
      const p:V=[x+bottom*Math.cos(a),y-height/2,z+bottom*Math.sin(a)],q:V=[x+bottom*Math.cos(b),y-height/2,z+bottom*Math.sin(b)];
      const r:V=[x+top*Math.cos(b),y+height/2,z+top*Math.sin(b)],s:V=[x+top*Math.cos(a),y+height/2,z+top*Math.sin(a)];
      tri(p,s,r,colour);tri(p,r,q,colour);tri([x,y+height/2,z],r,s,colour);tri([x,y-height/2,z],p,q,colour);
    }
  }
  function beam(a:V,b:V,radius:number,colour:Colour,sides=8) {
    const direction=b.map((x,i)=>x-a[i]),length=Math.hypot(...direction);const n=direction.map(x=>x/length);
    const basis=Math.abs(n[1])>.9?[1,0,0]:[0,1,0];
    const u=[n[1]*basis[2]-n[2]*basis[1],n[2]*basis[0]-n[0]*basis[2],n[0]*basis[1]-n[1]*basis[0]];const ul=Math.hypot(...u);for(let j=0;j<3;j++)u[j]/=ul;
    const v=[n[1]*u[2]-n[2]*u[1],n[2]*u[0]-n[0]*u[2],n[0]*u[1]-n[1]*u[0]];
    for(let i=0;i<sides;i++){const p=i*2*Math.PI/sides,q=(i+1)*2*Math.PI/sides;
      const at=(base:V,t:number):V=>base.map((x,j)=>x+radius*(u[j]*Math.cos(t)+v[j]*Math.sin(t))) as V;
      tri(at(a,p),at(a,q),at(b,q),colour);tri(at(a,p),at(b,q),at(b,p),colour);tri(b,at(b,p),at(b,q),colour);
    }
  }
  function sphere(x:number,y:number,z:number,rx:number,ry:number,rz:number,colour:Colour){
    const at=(a:number,b:number):V=>[x+rx*Math.sin(a)*Math.cos(b),y+ry*Math.cos(a),z+rz*Math.sin(a)*Math.sin(b)];
    for(let j=0;j<6;j++)for(let i=0;i<12;i++){const a=j*Math.PI/6,b=(j+1)*Math.PI/6,c=i*Math.PI/6,d=(i+1)*Math.PI/6;tri(at(a,c),at(a,d),at(b,d),colour);tri(at(a,c),at(b,d),at(b,c),colour);}
  }
  if(kind==='dubai'){
    cone(0,-1.22,0,.43,.38,.12,stone);
    // Three wings taper in alternating setbacks around the central core.
    for(let level=0;level<9;level++){
      const y=-1.1+level*.235, radius=.30-level*.026;
      cone(0,y,0,radius,radius*.98,.235,silver,12);
      for(let wing=0;wing<3;wing++){
        const a=wing*Math.PI*2/3,extra=(8-level-wing%2)*.022;
        cone(Math.cos(a)*extra,y,Math.sin(a)*extra,radius*.69,radius*.67,.23,silver,10);
      }
      cone(0,y+.113,0,radius*1.05,radius*1.05,.018,pale,12);
      for(let band=0;band<3;band++)cone(0,y-.08+band*.065,0,radius*1.015,radius*1.015,.006,dark,12);
    }
    cone(0,1.02,0,.065,.027,.32,silver);cone(0,1.28,0,.026,0,.28,pale,8);
  } else if(kind==='izmir'){
    cone(0,-1.23,0,.58,.58,.09,pale,8);cone(0,-1.14,0,.51,.51,.09,stone,8);
    cone(0,-.90,0,.32,.32,.43,stone,8);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;cone(Math.cos(a)*.38,-.87,Math.sin(a)*.38,.035,.035,.38,pale,6);}
    cone(0,-.63,0,.48,.43,.13,pale,8);cone(0,-.49,0,.38,.29,.14,stone,8);
    cone(0,-.14,0,.245,.22,.61,pale,8);cone(0,.2,0,.31,.31,.08,stone,8);
    box(0,.43,0,.43,.43,.43,pale);cone(0,.68,0,.33,.32,.09,stone,8);
    // Four white clock faces, with hands, remain readable at icon scale.
    for(let i=0;i<4;i++){const a=i*Math.PI/2,x=Math.sin(a),z=Math.cos(a);sphere(x*.224,.43,z*.224,.105,.105,.105,dark);sphere(x*.25,.43,z*.25,.083,.083,.083,pale);beam([x*.335,.43,z*.335],[x*.335,.495,z*.335],.008,dark,4);beam([x*.335,.43,z*.335],[x*.335+z*.05,.41,z*.335-x*.05],.008,dark,4);}
    for(let i=0;i<8;i++){const a=i*Math.PI/4;cone(Math.cos(a)*.235,.88,Math.sin(a)*.235,.026,.026,.33,pale,6);}
    cone(0,1.06,0,.31,.29,.07,stone,12);cone(0,1.17,0,.29,.02,.21,copper,16);beam([0,1.25,0],[0,1.4,0],.012,pale,6);
    for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2,x=Math.cos(a)*.39,z=Math.sin(a)*.39;cone(x,-1.03,z,.15,.14,.1,pale,8);cone(x,-.76,z,.17,.015,.16,copper,8);for(const d of [-1,1])cone(x+d*.08,-.9,z,.014,.014,.2,pale,6);}
  } else {
    box(0,-1.22,0,.88,.12,.68,stone);box(0,-1.02,0,.64,.28,.48,pale);box(0,-.81,0,.72,.1,.54,stone);
    // Faceted drapery, raised torch, tablet and seven-point crown.
    cone(0,-.39,0,.31,.18,.75,copper,16);sphere(0,.08,0,.21,.29,.13,copper);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;beam([Math.sin(a)*.13,.19,Math.cos(a)*.12],[Math.sin(a)*.29,-.74,Math.cos(a)*.27],.018,[.38,.73,.59],5);}
    cone(0,.33,0,.073,.073,.15,copper,8);sphere(0,.51,.015,.12,.17,.12,copper);
    // A small nose supplies a clear forward-facing silhouette.
    cone(0,.63,0,.14,.12,.04,[.37,.72,.60],12);
    for(let i=0;i<7;i++){const a=(i/6)*Math.PI;beam([Math.cos(a)*.10,.59,Math.sin(a)*.035],[Math.cos(a)*.30,.61+Math.sin(a)*.25,Math.sin(a)*.055],.018,copper,5);}
    sphere(0,.50,.12,.026,.043,.044,[.41,.76,.62]);
    beam([-.15,.24,0],[-.30,.61,0],.076,copper);beam([-.30,.61,0],[-.38,1.02,0],.052,copper);
    cone(-.38,1.03,0,.11,.075,.10,stone,10);cone(-.38,1.19,0,.075,.01,.23,[1,.70,.22],9);
    beam([.16,.21,0],[.30,-.08,.10],.07,copper);box(.27,-.02,.15,.17,.38,.07,[.24,.54,.46]);
  }
  const mesh=new Float32Array(vertices);meshes.set(kind,mesh);return mesh;
}

export default function LandmarkIcon({kind}:{kind:Kind}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});
    if(!gl)return;
    const data=geometry(kind);let program:WebGLProgram|null=null,buffer:WebGLBuffer|null=null,angleLocation:WebGLUniformLocation|null=null;
    let raf=0,last=0,angle=.38,visible=false,lost=false,disposed=false;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    function setup(){
      if(!gl)return false;
      const make=(type:number,source:string)=>{const shader=gl.createShader(type);if(!shader)return null;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}return shader;};
      const vs=make(gl.VERTEX_SHADER,`attribute vec3 p;attribute vec3 n;attribute vec3 c;uniform float angle;varying vec3 colour;
      vec3 turn(vec3 v){float s=sin(angle),c=cos(angle);vec3 a=vec3(c*v.x+s*v.z,v.y,-s*v.x+c*v.z);return vec3(a.x,.985*a.y-.174*a.z,.174*a.y+.985*a.z);}
      void main(){vec3 v=turn(p),normal=normalize(turn(n));float light=.55+.45*max(0.,dot(normal,normalize(vec3(-.5,.8,1.))));colour=c*light;gl_Position=vec4(v.x*1.18,v.y*.65,-v.z*.25,1.);}`);
      const fs=make(gl.FRAGMENT_SHADER,`precision mediump float;varying vec3 colour;void main(){gl_FragColor=vec4(colour,1.);}`);
      if(!vs||!fs){if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);return false;}
      program=gl.createProgram();if(!program)return false;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return false;
      gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      for(const[name,offset]of [['p',0],['n',3],['c',6]] as const){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,36,offset*4);}
      angleLocation=gl.getUniformLocation(program,'angle');gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
      const dpr=Math.min(window.devicePixelRatio||1,2);canvas!.width=Math.round(32*dpr);canvas!.height=Math.round(42*dpr);gl.viewport(0,0,canvas!.width,canvas!.height);return true;
    }
    function draw(){if(!gl||lost||disposed)return;gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(angleLocation,angle);gl.drawArrays(gl.TRIANGLES,0,data.length/9);}
    function frame(now:number){raf=0;if(!visible||document.hidden||lost||disposed)return;if(!last||now-last>=50){const dt=last?Math.min((now-last)/1000,.1):0;last=now;angle+=dt*Math.PI*2/32;draw();}if(!reduced.matches)raf=requestAnimationFrame(frame);}
    function start(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;if(visible&&!document.hidden&&!lost&&!disposed)raf=requestAnimationFrame(frame);}
    if(!setup())return;draw();
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start();});observer.observe(canvas);
    const lose=(e:Event)=>{e.preventDefault();lost=true;start();};const restore=()=>{lost=false;if(setup()){draw();start();}};
    canvas.addEventListener('webglcontextlost',lose);canvas.addEventListener('webglcontextrestored',restore);
    document.addEventListener('visibilitychange',start);reduced.addEventListener('change',start);
    return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',start);reduced.removeEventListener('change',start);canvas.removeEventListener('webglcontextlost',lose);canvas.removeEventListener('webglcontextrestored',restore);gl.deleteBuffer(buffer);gl.deleteProgram(program);};
  },[kind]);
  return <canvas ref={ref} width={64} height={84} aria-hidden="true" className="shrink-0 pointer-events-none" style={{width:32,height:42,display:'inline-block',verticalAlign:'middle'}} />;
}

import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {loadVehicle, setVehiclePaint} from './vehicles/vehicles.js';

const moods = {
  day: {sky:'#9aa8af',horizon:'#808b93',ground:'#52595d',deck:'#717b7e',engraving:'#47545a',key:'#fff5e8',edge:'#d1ebff',fill:'#f4f3ee',env:.90,exposure:.94},
  sunset: {sky:'#e4bcb0',horizon:'#bca099',ground:'#877777',deck:'#a19089',engraving:'#756766',key:'#ffb16b',edge:'#99c1ff',fill:'#ffe1c2',env:.92,exposure:.99},
  night: {sky:'#111d30',horizon:'#28384a',ground:'#202a37',deck:'#32404d',engraving:'#596b73',key:'#c9dfff',edge:'#ffae82',fill:'#a7d1ff',env:.74,exposure:1.00}
};
const directions = {
  front:[.74,.235,-1],side:[.004,.15,-1],back:[-.77,.265,-1],top:[.003,1,-.027]
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

// The high-dynamic-range panels paint continuous reflections across glass and bodywork.
function studioEnvironment(renderer,mood) {
  const w=384,h=192,data=new Float32Array(w*h*4);
  const fill=new THREE.Color(mood.fill), edge=new THREE.Color(mood.edge), key=new THREE.Color(mood.key);
  const panels=[
    [.19,.62,.088,.042,4.8,key], [.76,.65,.104,.034,4.9,fill],
    [.48,.77,.14,.046,3.7,fill], [.93,.55,.028,.066,4.4,edge],
    [.32,.53,.048,.038,2.1,key], [.07,.79,.09,.060,2.9,edge]
  ];
  const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
  for(let y=0;y<h;y++){
    const v=(y+.5)/h;
    for(let x=0;x<w;x++){
      const u=(x+.5)/w, i=(y*w+x)*4;
      const ceiling=.07+.31*ease((v-.48)/.34), wall=.13*Math.exp(-Math.pow((v-.49)/.035,2));
      let r=ceiling*fill.r+wall,g=ceiling*fill.g+wall,b=ceiling*fill.b+wall;
      for(const [cx,cy,rx,ry,power,tint] of panels){
        const dx=Math.min(Math.abs(u-cx),1-Math.abs(u-cx))/rx,dy=Math.abs(v-cy)/ry;
        const strength=power*ease((1.15-dx)/.32)*ease((1.18-dy)/.38);
        r+=tint.r*strength;g+=tint.g*strength;b+=tint.b*strength;
      }
      data[i]=r;data[i+1]=g;data[i+2]=b;data[i+3]=1;
    }
  }
  const tex=new THREE.DataTexture(data,w,h,THREE.RGBAFormat,THREE.FloatType);
  tex.mapping=THREE.EquirectangularReflectionMapping;
  tex.colorSpace=THREE.LinearSRGBColorSpace;tex.needsUpdate=true;
  const generator=new THREE.PMREMGenerator(renderer);
  const target=generator.fromEquirectangular(tex);
  tex.dispose();generator.dispose();
  return target;
}
function skyTexture(mood) {
  const canvas=document.createElement('canvas');canvas.width=4;canvas.height=128;
  const ctx=canvas.getContext('2d'),g=ctx.createLinearGradient(0,0,0,128);
  g.addColorStop(0,mood.sky);g.addColorStop(.13,mood.horizon);g.addColorStop(1,mood.horizon);
  ctx.fillStyle=g;ctx.fillRect(0,0,4,128);
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
function contactTexture() {
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
  const ctx=canvas.getContext('2d'),g=ctx.createRadialGradient(128,128,15,128,128,124);
  g.addColorStop(0,'rgba(9,12,15,.86)');g.addColorStop(.46,'rgba(10,12,14,.61)');
  g.addColorStop(.75,'rgba(8,10,13,.26)');g.addColorStop(1,'rgba(7,9,12,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,256,256);
  return new THREE.CanvasTexture(canvas);
}
function disposeTree(root) {
  const geometries=new Set(), materials=new Set(), textures=new Set();
  root.traverse(obj=>{
    if(obj.geometry)geometries.add(obj.geometry);
    if(obj.material)for(const material of [].concat(obj.material))materials.add(material);
  });
  for(const material of materials)for(const value of Object.values(material))if(value?.isTexture && !value.isRenderTargetTexture)textures.add(value);
  for(const resource of [...textures,...materials,...geometries])resource.dispose();
}
export function createViewer(mount,{onManual=()=>{},onHome=()=>{},onLoss=()=>{}}={}) {
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
  const canvas=renderer.domElement;canvas.tabIndex=0;
  canvas.setAttribute('aria-label','車輛 3D 畫面。方向鍵旋轉，加減鍵縮放，Home 回到前方。');
  mount.appendChild(canvas);
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(33,1,.08,110);
  const controls=new OrbitControls(camera,canvas);
  controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.12;
  controls.rotateSpeed=.68;controls.zoomSpeed=.77;controls.maxPolarAngle=Math.PI*.485;
  controls.minPolarAngle=.024;controls.autoRotateSpeed=.85;
  const hemi=new THREE.HemisphereLight(0xe6ecf0,0x77706a,.72);
  const key=new THREE.DirectionalLight(0xffffff,2.15);key.position.set(3.4,7,-4);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.5,far:23});
  key.shadow.normalBias=.016;key.shadow.bias=-.00035;key.shadow.radius=3;
  const rim=new THREE.DirectionalLight(0xffffff,1.76);rim.position.set(-3.8,3.8,3.1);
  const noseLight=new THREE.DirectionalLight(0xffffff,.60);noseLight.position.set(5,2.2,2);
  scene.add(hemi,key,rim,noseLight);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({roughness:.93,metalness:.04}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.080;floor.receiveShadow=true;
  const plinth=new THREE.Mesh(new THREE.CylinderGeometry(3.67,3.69,.074,128),new THREE.MeshStandardMaterial({roughness:.78,metalness:.13}));
  plinth.position.y=-.042;plinth.receiveShadow=true;
  const inlay=new THREE.Mesh(new THREE.RingGeometry(3.38,3.39,128),new THREE.MeshBasicMaterial({transparent:true,opacity:.38,depthWrite:false}));
  inlay.rotation.x=-Math.PI/2;inlay.position.y=-.004;
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:contactTexture(),transparent:true,depthWrite:false,opacity:.89,toneMapped:false}));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=.002;
  scene.add(floor,plinth,inlay,shadow);
  const envs=new Map(),skies=new Map();
  const glass=new Set();
  const bounds=new THREE.Box3(new THREE.Vector3(-2.5,0,-1.1),new THREE.Vector3(2.5,1.55,1.1));
  const measure=new THREE.Vector3(), focus=new THREE.Vector3(0,.75,0);
  const silhouette=[];
  let car=null,activeAngle='front',activeMood='',frame=0,lastTick=0,alive=true,visible=true,tween=null,loadSerial=0;
  const offset=new THREE.Vector3(), spherical=new THREE.Spherical();
  function requestFrame(){if(alive&&visible&&!document.hidden&&!frame)frame=requestAnimationFrame(draw);}
  function draw(now) {
    frame=0;if(!alive||!visible||document.hidden)return;
    const delta=Math.min(.066,(now-(lastTick||now))/1000);lastTick=now;
    if(tween){
      const v=Math.min(1,(now-tween.time)/390),ease=1-Math.pow(1-v,3);
      spherical.set(
        THREE.MathUtils.lerp(tween.from.radius,tween.to.radius,ease),
        THREE.MathUtils.lerp(tween.from.phi,tween.to.phi,ease),
        THREE.MathUtils.lerp(tween.from.theta,tween.to.theta,ease)
      );
      camera.position.copy(controls.target).add(offset.setFromSpherical(spherical));
      if(v===1)tween=null;
    }
    const changed=controls.update(delta);
    renderer.render(scene,camera);
    if(tween||controls.autoRotate||changed)requestFrame();
  }
  function cameraFor(name) {
    const normal=new THREE.Vector3(...directions[name]).normalize();
    const right=new THREE.Vector3().crossVectors(camera.up,normal).normalize();
    const up=new THREE.Vector3().crossVectors(normal,right).normalize();
    const tanV=Math.tan(THREE.MathUtils.degToRad(camera.fov)*.5),tanH=tanV*camera.aspect;
    let distance=0;
    for(const rel of silhouette){
      distance=Math.max(distance,rel.dot(normal)+Math.max(Math.abs(rel.dot(right))/(tanH*.82),Math.abs(rel.dot(up))/(tanV*.69)));
    }
    if(!silhouette.length)distance=9;
    return new THREE.Spherical().setFromVector3(normal.multiplyScalar(distance));
  }
  function setAngle(name,instant=false) {
    if(!directions[name])return;
    activeAngle=name;controls.target.copy(focus);
    const to=cameraFor(name);
    controls.minDistance=Math.max(2.0,measure.x*.48);controls.maxDistance=Math.max(16,to.radius*2.2);
    if(instant||reduced.matches||!car){
      tween=null;camera.position.copy(focus).add(offset.setFromSpherical(to));controls.update();
    }else{
      const from=new THREE.Spherical().setFromVector3(offset.copy(camera.position).sub(focus));
      const diff=to.theta-from.theta;to.theta=from.theta+Math.atan2(Math.sin(diff),Math.cos(diff));
      tween={from,to,time:performance.now()};
    }
    requestFrame();
  }
  function setLight(name) {
    if(!moods[name]||activeMood===name)return;
    activeMood=name;const m=moods[name];
    if(!envs.has(name)){envs.set(name,studioEnvironment(renderer,m));skies.set(name,skyTexture(m));}
    scene.environment=envs.get(name).texture;scene.environmentIntensity=m.env;scene.background=skies.get(name);
    for(const mat of glass){mat.envMap=scene.environment;mat.envMapIntensity=.40*m.env;mat.needsUpdate=true;}
    scene.fog=new THREE.FogExp2(m.horizon,.036);
    key.color.set(m.key);rim.color.set(m.edge);hemi.color.set(m.fill);
    key.intensity=name==='night'?1.45:2.15;rim.intensity=name==='night'?2.35:1.76;
    key.position.set(name==='sunset'?-3:3.4,name==='sunset'?3.2:7,-4);
    hemi.intensity=name==='night'?.34:.72;
    floor.material.color.set(m.ground);plinth.material.color.set(m.deck);inlay.material.color.set(m.engraving);
    renderer.toneMappingExposure=m.exposure;
    if(car)renderer.render(scene,camera);
    requestFrame();
  }
  async function load(id,hex) {
    const serial=++loadSerial;
    const model=await loadVehicle(THREE,id,hex);
    if(!alive || serial!==loadSerial){disposeTree(model);return;}
    if(car){scene.remove(car);disposeTree(car);}
    car=model;scene.add(car);bounds.setFromObject(car,true);bounds.getSize(measure);bounds.getCenter(focus);
    glass.clear();
    car.traverse(mesh=>{
      if(!mesh.isMesh)return;
      for(const mat of [].concat(mesh.material)){
        if(mat.name==='glass'||mat.name==='tinted'){
          mat.color.set('#192a34');mat.roughness=.145;mat.metalness=.13;mat.clearcoat=.24;
          if(mat.transparent)mat.opacity=.84;
          mat.envMap=scene.environment;mat.envMapIntensity=.40*(moods[activeMood]?.env||1);glass.add(mat);
        }
      }
    });
    focus.y=bounds.min.y+measure.y*.50;
    silhouette.length=0;
    car.traverse(mesh=>{
      const vertices=mesh.geometry?.getAttribute('position');
      if(!vertices)return;
      const stride=Math.max(1,Math.floor(vertices.count/420));
      for(let i=0;i<vertices.count;i+=stride){
        silhouette.push(new THREE.Vector3().fromBufferAttribute(vertices,i).applyMatrix4(mesh.matrixWorld).sub(focus));
      }
    });
    shadow.scale.set(measure.x*1.22,measure.z*1.34,1);
    const podiumSize=Math.max(1,measure.x/5.15);
    plinth.scale.set(podiumSize,1,podiumSize);inlay.scale.set(podiumSize,podiumSize,1);
    setAngle(activeAngle||'front',true);renderer.render(scene,camera);
  }
  function manual(){activeAngle='';tween=null;controls.autoRotate=false;onManual();requestFrame();}
  function zoom(multiplier){
    tween=null;
    const reach=offset.copy(camera.position).sub(controls.target);
    const distance=THREE.MathUtils.clamp(reach.length()*multiplier,controls.minDistance,controls.maxDistance);
    camera.position.copy(controls.target).add(reach.setLength(distance));controls.update();requestFrame();
  }
  function keydown(e){
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(e.key))return;
    e.preventDefault();
    if(e.key==='Home'){manual();setAngle('front');onHome();return;}
    if(['+','=','-'].includes(e.key)){zoom(e.key==='-'?1.16:.86);return;}
    manual();spherical.setFromVector3(offset.copy(camera.position).sub(controls.target));
    if(e.key==='ArrowLeft')spherical.theta-=.18;
    if(e.key==='ArrowRight')spherical.theta+=.18;
    if(e.key==='ArrowUp')spherical.phi-=.12;
    if(e.key==='ArrowDown')spherical.phi+=.12;
    spherical.phi=THREE.MathUtils.clamp(spherical.phi,controls.minPolarAngle,controls.maxPolarAngle);
    camera.position.copy(controls.target).add(offset.setFromSpherical(spherical));controls.update();requestFrame();
  }
  function resize(){
    const {width,height}=mount.getBoundingClientRect();
    if(width<1||height<1)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
    if(activeAngle)setAngle(activeAngle,true);else requestFrame();
  }
  function lost(e){e.preventDefault();if(alive)onLoss();}
  controls.addEventListener('change',requestFrame);
  controls.addEventListener('start',manual);
  canvas.addEventListener('keydown',keydown);canvas.addEventListener('webglcontextlost',lost);
  document.addEventListener('visibilitychange',requestFrame);
  const observer=new ResizeObserver(resize);observer.observe(mount);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestFrame();});intersection.observe(mount);
  resize();
  return {load,setAngle,setLight,zoom,
    setColor(hex){if(car){setVehiclePaint(car,hex);renderer.render(scene,camera);requestFrame();}},
    setRotate(on){tween=null;controls.autoRotate=on;if(on)activeAngle='';requestFrame();},
    dispose(){
      if(!alive)return;alive=false;cancelAnimationFrame(frame);
      observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',requestFrame);
      canvas.removeEventListener('keydown',keydown);canvas.removeEventListener('webglcontextlost',lost);
      controls.removeEventListener('change',requestFrame);controls.removeEventListener('start',manual);controls.dispose();
      scene.environment=null;scene.background=null;for(const mat of glass)mat.envMap=null;glass.clear();disposeTree(scene);
      for(const value of envs.values())value.dispose();for(const tex of skies.values())tex.dispose();
      key.shadow.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();
    }
  };
}

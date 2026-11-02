import * as THREE from 'three';
import {SEGMENTS as N,armPose,cruisePose} from './motion.js';
export function createSentinel(scene){
 const metal=(c,r=.4)=>new THREE.MeshStandardMaterial({color:c,metalness:.88,roughness:r});
 // Deterministic fine machining texture, shared by all structural metals.
 const data=new Uint8Array(128*128*4);let seed=19;
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){seed=(seed*1664525+1013904223)>>>0;const v=140+(seed%45)+(x%23===0?55:0);const p=(y*128+x)*4;data[p]=data[p+1]=data[p+2]=v;data[p+3]=255;}
 const texture=new THREE.DataTexture(data,128,128);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(3,2);texture.needsUpdate=true;
 const steel=metal('#64716c'),armor=metal('#45504c'),dark=metal('#171e1c',.54),edge=metal('#a6ada5',.31),copper=metal('#615247',.5);
 for(const m of [steel,armor,edge]){m.roughnessMap=texture;m.bumpMap=texture;m.bumpScale=.012;}
 const lens=new THREE.MeshBasicMaterial({color:'#fa180a',toneMapped:false}),hot=new THREE.MeshBasicMaterial({color:'#ff9870',toneMapped:false});
 const coreLight=new THREE.MeshStandardMaterial({color:'#658572',emissive:'#327156',emissiveIntensity:.7,metalness:.5,roughness:.38});
 const body=new THREE.Group(),head=new THREE.Group(),core=new THREE.Group(),shell=new THREE.Group();body.add(head,core,shell);scene.add(body);
 const sphere=new THREE.SphereGeometry(1,20,14),cylinder=new THREE.CylinderGeometry(1,1,1,10),box=new THREE.BoxGeometry(1,1,1),boltGeo=new THREE.CylinderGeometry(.035,.035,.035,6),plates=[];
 function mesh(g,m,p,pos=[0,0,0],scale=[1,1,1]){const o=new THREE.Mesh(g,m);o.position.set(...pos);o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;}
 function ball(p,m,pos,scale){return mesh(sphere,m,p,pos,scale);}
 const up=new THREE.Vector3(0,1,0);
 function tube(p,m,a,b,r=.04){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b);const o=mesh(cylinder,m,p,va.clone().add(vb).multiplyScalar(.5).toArray(),[r,va.distanceTo(vb),r]);o.quaternion.setFromUnitVectors(up,vb.sub(va).normalize());return o;}
 function cable(p,points,r=.025,m=dark){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v))),24,r,6,false),m,p);}
 // Exposed axial chassis: stepped reactor, retaining rings, rails and copper conduits.
 ball(core,dark,[0,0,-.25],[.55,.43,1.65]);ball(core,coreLight,[0,0,-.15],[.57,.45,1.35]);
 for(let i=0;i<17;i++){const z=-1.8+i*.19;mesh(new THREE.TorusGeometry(.52,.035,6,28),i%3===0?edge:steel,core,[0,0,z],[1.15,.9,1]);}
 for(let i=0;i<8;i++){const a=i*Math.PI/4;const x=Math.cos(a)*.68,y=Math.sin(a)*.52;tube(core,steel,[x,y,-1.9],[x,y,1],.045);cable(core,[[x,y,-1.8],[x*1.2,y*1.2,-.8],[x*.9,y*.9,.3],[x,y,.9]],.025,i%2?dark:copper);}
 // Angular overlapping plates replace the smooth bead-like hull.
 for(let s of [-1,1])for(let i=0;i<4;i++){
  const g=new THREE.Group();g.position.set(s*.58,.45,-1.4+i*.6);g.rotation.z=-s*.35;shell.add(g);plates.push({p:g,base:g.position.clone(),side:s});
  const shape=new THREE.Shape();shape.moveTo(-.42,-.29);shape.lineTo(.38,-.24);shape.lineTo(.48,.18);shape.lineTo(.2,.33);shape.lineTo(-.4,.27);shape.closePath();
  const plate=mesh(new THREE.ExtrudeGeometry(shape,{depth:.06,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.025}),armor,g);plate.rotation.x=-Math.PI/2;
  for(let k=0;k<5;k++)mesh(box,dark,g,[-.24+k*.105,.08,0],[.025,.025,.3]);
  for(const x of [-.32,.3]){const b=mesh(boltGeo,edge,g,[x,.09,.19]);}
 }
 // Broad low skull, exposed underside and asymmetrical sensor clusters.
 ball(head,dark,[0,-.03,.8],[1.12,.73,.8]);
 const skull=mesh(new THREE.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI*.48),armor,head,[0,-.02,.7],[1.18,.88,.95]);
 for(let s of [-1,1]){
  for(let k=0;k<7;k++){const z=.35+k*.17;tube(head,steel,[s*.95,.3,z],[s*1.12,-.3,z+.1],.035);}
  cable(head,[[s*.7,.6,.3],[s*1,.4,.7],[s*1.1,-.2,1.3],[s*.7,-.55,1.7]],.055,steel);
  cable(head,[[s*.65,-.5,.1],[s*1.1,-.6,.6],[s*.9,-.7,1.5]],.045,copper);
  tube(head,steel,[s*.65,-.45,1.3],[s*.84,-.85,1.8],.09);tube(head,edge,[s*.84,-.85,1.8],[s*.4,-1,2.05],.045);
  tube(head,dark,[s*.4,-1,2.05],[s*.25,-.7,2.2],.025);
 }
 const eyeSpecs=[[0,.27,.23],[-.45,.36,.17],[.43,.4,.19],[-.78,.2,.14],[.8,.12,.125],[-.23,-.12,.2],[.27,-.17,.155],[-.63,-.22,.115],[.63,-.35,.12],[-.1,.62,.105],[.35,.66,.075],[-.92,-.12,.075],[.03,-.45,.085]];
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=64;const ctx=glowCanvas.getContext('2d');const gradient=ctx.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'rgba(255,30,5,.35)');gradient.addColorStop(.25,'rgba(255,20,0,.12)');gradient.addColorStop(1,'rgba(255,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);const glowMat=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(glowCanvas),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});
 for(const [x,y,r] of eyeSpecs){const g=new THREE.Group();g.position.set(x,y,1.85-.35*(x*x+y*y));g.rotation.y=x*.48;g.rotation.x=-y*.3;head.add(g);
  const housing=mesh(new THREE.CylinderGeometry(r*1.28,r*1.42,.24,18),dark,g);housing.rotation.x=Math.PI/2;
  for(let k=0;k<3;k++)mesh(new THREE.TorusGeometry(r*1.15,.018,6,24),steel,g,[0,0,.03+k*.047]);
  ball(g,lens,[0,0,.15],[r,r,.055]);mesh(new THREE.TorusGeometry(r*.75,.009,5,24),hot,g,[0,0,.202]);ball(g,hot,[-r*.2,r*.2,.205],[r*.16,r*.16,.008]);
  for(let k=0;k<3;k++){const a=k*Math.PI*2/3;const b=mesh(boltGeo,edge,g,[Math.cos(a)*r*1.32,Math.sin(a)*r*1.32,.11],[.55,.55,.55]);b.rotation.x=Math.PI/2;}
  const glow=new THREE.Sprite(glowMat);glow.position.z=.21;glow.scale.setScalar(r*5);g.add(glow);
 }
 const eyeLight=new THREE.PointLight(0xff3018,1.6,4);eyeLight.position.set(0,0,2.5);head.add(eyeLight);
 const arms=[];
 const linkGeo=new THREE.CylinderGeometry(.13,.16,1,10),jointGeo=new THREE.SphereGeometry(.15,10,8),ringGeo=new THREE.TorusGeometry(.162,.022,5,12);ringGeo.rotateX(Math.PI/2);
 const tendonGeo=new THREE.CylinderGeometry(.023,.023,1,6),pinGeo=new THREE.CylinderGeometry(.045,.045,.36,8);pinGeo.rotateZ(Math.PI/2);
 for(let i=0;i<10;i++){
  const group=new THREE.Group();body.add(group);
  const inst=(g,m,n)=>{const o=new THREE.InstancedMesh(g,m,n);o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;group.add(o);return o;};
  const links=inst(linkGeo,steel,N),joints=inst(jointGeo,dark,N+1),rings=inst(ringGeo,edge,N*2),tendons=inst(tendonGeo,dark,N*3),pins=inst(pinGeo,edge,N);
  const claw=new THREE.Group();group.add(claw);ball(claw,dark,[0,.05,0],[.18,.2,.18]);const fingers=[];
  for(let k=0;k<3;k++){const f=new THREE.Group();f.rotation.y=k*Math.PI*2/3;claw.add(f);tube(f,steel,[.1,0,0],[.24,.25,0],.06);tube(f,edge,[.24,.25,0],[.19,.5,0],.035);const tip=mesh(new THREE.ConeGeometry(.05,.25,6),steel,f,[.12,.56,0]);tip.rotation.z=.6;fingers.push(f);}
  arms.push({group,links,joints,rings,tendons,pins,claw,fingers,points:Array.from({length:N+1},()=>new THREE.Vector3())});
 }
 const dummy=new THREE.Object3D(),direction=new THREE.Vector3(),q=new THREE.Quaternion(),offset=new THREE.Vector3();
 function instance(inst,index,pos,rotation,scale){dummy.position.copy(pos);dummy.quaternion.copy(rotation);dummy.scale.set(...scale);dummy.updateMatrix();inst.setMatrixAt(index,dummy.matrix);}
 const identity=new THREE.Quaternion();
 const targetPosition=new THREE.Vector3(),targetRotation=new THREE.Quaternion(),targetEuler=new THREE.Euler();
 function update(t,spread,hunt,coil,explode,part,dt){
  const cruise=cruisePose(t);
  const travel=part==='all'?Math.max(0,1-Math.max(hunt,coil,explode*3)):0;
  targetPosition.set(...cruise.position).multiplyScalar(travel);
  targetPosition.y+=Math.sin(t*.52)*.13;
  targetEuler.set(cruise.pitch,cruise.heading,cruise.bank);
  targetRotation.setFromEuler(targetEuler);
  if(travel<.99)targetRotation.slerp(new THREE.Quaternion(),1-travel);
  const ease=1-Math.exp(-dt*2.5);
  body.position.lerp(targetPosition,ease);body.quaternion.slerp(targetRotation,ease);
  head.position.z=explode*1.7;shell.position.y=explode*1.5;plates.forEach(({p,base,side})=>{p.position.copy(base);p.position.x+=side*explode*.7;});
  head.visible=part==='all'||part==='head';core.visible=part==='all'||part==='core';shell.visible=part==='all';
  for(let i=0;i<10;i++){
   const a=arms[i];a.group.visible=part==='all'||(part==='arm'&&i===0);a.group.position.set(part==='arm'?-3:0,0,part==='arm'?1.6:0);
   const raw=armPose(i,t,spread,hunt,coil,explode);raw.forEach((p,j)=>a.points[j].set(...p));
   for(let j=0;j<=N;j++){const u=j/N,w=1-u*.72;instance(a.joints,j,a.points[j],identity,[w,w,w]);if(j===N)break;
    const p=a.points[j],end=a.points[j+1];direction.copy(end).sub(p);const len=direction.length();q.setFromUnitVectors(up,direction.normalize());const mid=p.clone().add(end).multiplyScalar(.5);
    instance(a.links,j,mid,q,[w,len*.8,w]);instance(a.pins,j,mid,q,[w,w,w]);
    for(let k=0;k<2;k++){offset.set(0,(k?1:-1)*len*.32,0).applyQuaternion(q).add(mid);instance(a.rings,j*2+k,offset,q,[w,w,w]);}
    for(let k=0;k<3;k++){const angle=k*Math.PI*2/3+u*2;offset.set(Math.cos(angle)*.155*w,0,Math.sin(angle)*.155*w).applyQuaternion(q).add(mid);instance(a.tendons,j*3+k,offset,q,[w,len*1.12,w]);}
   }
   for(const key of ['links','joints','rings','tendons','pins'])a[key].instanceMatrix.needsUpdate=true;
   a.claw.position.copy(a.points[N]);a.claw.quaternion.setFromUnitVectors(up,a.points[N].clone().sub(a.points[N-1]).normalize());a.claw.scale.setScalar(.7);
   a.fingers.forEach((f,k)=>f.rotation.z=.12+Math.sin(t*.63+i+k*.3)*.09+hunt*.14);
  }
 }
 return {armor,arms,N,update};
}

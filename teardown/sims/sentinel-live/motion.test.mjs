import assert from 'node:assert/strict';
import {armPose,SEGMENTS} from './motion.js';
let maximumLengthError=0, maximumFrameDisplacement=0;
for(let i=0;i<10;i++)for(const coil of [0,.5,1])for(const hunt of [0,1])for(const spread of [.1,1])for(const t of [0,1,10,40]){
 const points=armPose(i,t,spread,hunt,coil),next=armPose(i,t+1/60,spread,hunt,coil);
 const segmentLength=(5.7+.8*Math.sin(i*2.3+1))/SEGMENTS;
 assert.equal(points.length,SEGMENTS+1);
 assert.ok(points.flat().every(Number.isFinite));
 assert.deepEqual(points,armPose(i,t,spread,hunt,coil),'A paused timeline must reproduce the same pose');
 for(let j=1;j<points.length;j++){
  const length=Math.hypot(...points[j].map((v,k)=>v-points[j-1][k]));
  maximumLengthError=Math.max(maximumLengthError,Math.abs(length-segmentLength));
  assert.ok(Math.abs(length-segmentLength)<1e-10,'Chain links must not stretch');
  const travel=Math.hypot(...points[j].map((v,k)=>v-next[j][k]));
  maximumFrameDisplacement=Math.max(maximumFrameDisplacement,travel);
  assert.ok(travel<.1,'No large pose jumps at a 60 Hz timeline');
 }
 const exploded=armPose(i,t,spread,hunt,coil,1);
 for(let j=1;j<points.length;j++)for(let k=0;k<3;k++)assert.ok(Math.abs((exploded[j][k]-points[j][k])-(exploded[0][k]-points[0][k]))<1e-10,'Exploding an arm must rigidly translate its chain');
}
console.log({maximumLengthError,maximumFrameDisplacement,cases:480});

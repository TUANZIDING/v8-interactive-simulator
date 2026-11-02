// Fixed-length chain integration: delayed travelling curvature, independent phases,
// and a blended pose parameter keep joints attached during mode transitions.
export const SEGMENTS=40;
export function armPose(i,t,spread,hunt,coil,explode=0){
 const angle=i*Math.PI*2/10+.09*Math.sin(i*4.1);
 const length=5.7+.8*Math.sin(i*2.3+1);
 let x=Math.cos(angle)*.91,y=Math.sin(angle)*.62,z=-.65-(i%3)*.23;
 x+=Math.cos(angle)*explode*.9;y+=Math.sin(angle)*explode*.9;
 const points=[[x,y,z]];
 for(let j=1;j<=SEGMENTS;j++){
  const u=(j-.5)/SEGMENTS,delay=t*.73-u*3.5+i*1.87;
  const envelope=u*u*(3-2*u);
  const wave=Math.sin(delay)*.95+Math.sin(delay*.61+i)*.27;
  const curl=coil*2.7*envelope+(1-coil)*1.1*Math.sin(t*.32+i*1.3)*envelope;
  const az=angle+wave*envelope+curl;
  const rear=.32+(1-spread)*.62+u*.5-hunt*.35*Math.sin(u*Math.PI);
  const pitch=rear+.32*Math.sin(delay*.8+.6)*envelope-coil*.5;
  const step=length/SEGMENTS;
  const denom=Math.sqrt(1+pitch*pitch);
  x+=Math.cos(az)*step/denom;
  y+=Math.sin(az)*step/denom;
  z-=pitch*step/denom;
  points.push([x,y,z]);
 }
 return points;
}

// The skull faces +Z; heading follows the path tangent rather than camera direction.
export function cruisePose(t){
 const a=t*.38-Math.PI/2;
 return {position:[1.7*Math.sin(a),.32*Math.sin(a*2),1.25*Math.cos(a)],
 heading:Math.atan2(1.7*Math.cos(a),-1.25*Math.sin(a)),
 pitch:-.09*Math.cos(a*2),bank:-.14};
}

// Code-authored vector mark inspired by the supplied layered neural-network sketch.
// Raster fallbacks share the same node/edge geometry; no font or external rasterizer is needed.
import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
import ts from 'typescript';
const source=await readFile('src/data/brand.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {neuralMark}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const {size:markSize,nodes,radius,strokeWidth,background,connection}=neuralMark;
const edges=neuralMark.edges.map(([a,b])=>[nodes[a],nodes[b]]);
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${background}"/>${edges.map(([a,b])=>`<path d="M${a.join(' ')}L${b.join(' ')}" stroke="${connection}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`).join('')}${nodes.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${radius}" fill="#fff"/>`).join('')}</svg>`;
const crc32=b=>{let c=0xffffffff;for(const v of b){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;};
const chunk=(type,data)=>{const tag=Buffer.from(type),length=Buffer.alloc(4),crc=Buffer.alloc(4);length.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([tag,data])));return Buffer.concat([length,tag,data,crc]);};
function png(size,opaque=false) {
 const pixels=Buffer.alloc(size*(size*4+1)),scale=size/markSize;
 const distance=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);};
 for(let iy=0;iy<size;iy++)for(let ix=0;ix<size;ix++){let r=0,g=0,b=0,alpha=0;for(let sy=0;sy<4;sy++)for(let sx=0;sx<4;sx++){const x=(ix+(sx+.5)/4)/scale,y=(iy+(sy+.5)/4)/scale,dx=Math.max(8-x,0,x-24),dy=Math.max(8-y,0,y-24),inside=opaque||Math.hypot(dx,dy)<=8;if(!inside)continue;let color=rgb(background);if(edges.some(([a,b])=>distance(x,y,a,b)<=strokeWidth/2))color=rgb(connection);if(nodes.some(([a,b])=>Math.hypot(x-a,y-b)<=radius))color=[255,255,255];r+=color[0];g+=color[1];b+=color[2];alpha++;}const offset=iy*(size*4+1)+1+ix*4;if(alpha){pixels[offset]=Math.round(r/alpha);pixels[offset+1]=Math.round(g/alpha);pixels[offset+2]=Math.round(b/alpha);pixels[offset+3]=Math.round(255*alpha/16);}}
 const header=Buffer.alloc(13);header.writeUInt32BE(size,0);header.writeUInt32BE(size,4);header[8]=8;header[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]);
}
await mkdir('public',{recursive:true});await writeFile('public/favicon.svg',svg);await writeFile('public/favicon-32.png',png(32));await writeFile('public/favicon-96.png',png(96));await writeFile('public/apple-touch-icon.png',png(180,true));await writeFile('public/social-icon.png',png(512,true));
console.log('Generated neural network SVG and PNG icons.');

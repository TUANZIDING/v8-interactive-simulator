import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files = {'/':'index.html','/index.html':'index.html','/sentinel.html':'sentinel.html','/gallery.html':'gallery.html','/assets/v8-v1.0.jpg':'assets/v8-v1.0.jpg','/assets/sentinel-v1.0.jpg':'assets/sentinel-v1.0.jpg'};
http.createServer(async(req,res)=>{
 const file=files[req.url];
 if(!file){res.writeHead(404);res.end();return;}
 try{const data=await readFile(new URL('./docs/'+file,import.meta.url));res.writeHead(200,{'Content-Type':file.endsWith('.jpg')?'image/jpeg':'text/html; charset=utf-8'});res.end(data);}catch{res.writeHead(500);res.end('Build required');}
}).listen(Number(process.env.PORT||4174),'127.0.0.1',()=>console.log('http://127.0.0.1:'+(process.env.PORT||4174)+'/gallery.html'));

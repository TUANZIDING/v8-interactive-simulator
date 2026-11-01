import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files = {'/':'index.html','/index.html':'index.html','/sentinel.html':'sentinel.html'};
http.createServer(async(req,res)=>{
 const file=files[req.url];
 if(!file){res.writeHead(404);res.end();return;}
 try{const data=await readFile(new URL('./docs/'+file,import.meta.url));res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(data);}catch{res.writeHead(500);res.end('Build required');}
}).listen(4174,'127.0.0.1',()=>console.log('http://127.0.0.1:4174/sentinel.html'));

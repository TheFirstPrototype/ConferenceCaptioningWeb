const {chromium}=require('playwright-core');
const fs=require('fs');fs.mkdirSync(__dirname+'/frames',{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const p=await b.newPage({viewport:{width:1920,height:1080}});await p.goto('file://'+__dirname+'/video.html');await p.waitForTimeout(800);
const N=60*24;for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/24);await p.screenshot({path:`frames/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});}
await b.close();console.log('done')})();

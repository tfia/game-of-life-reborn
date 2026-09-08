const assert=require('assert');
const listeners=[]; const document={addEventListener:(t,f,c)=>listeners.push(f),documentElement:{contains:()=>true}};
let started=0; const target={closest:s=>s==='#gol-button-play'?target:null};
listeners.push(function(e){const t=e.target&&e.target.closest&&e.target.closest('#gol-button-play');if(t&&document.documentElement.contains(t)){e.preventDefault();started++}});
let prevented=false; listeners[0]({target,preventDefault:()=>{prevented=true}}); assert(prevented); assert.equal(started,1); console.log('pointer fixture ok');

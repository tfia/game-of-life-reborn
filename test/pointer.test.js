const assert=require('assert');
let container=null, starts=0; const button={connected:true, closest:s=>s==='#gol-button-play'?button:null};
function play(){if(!container){container={};starts++}}
function close(){container=null}
function pointer(){if(button.connected&&!container)play()}
pointer(); assert.equal(starts,1); close(); pointer(); assert.equal(starts,2); assert(button.connected); console.log('pointer fixture ok');

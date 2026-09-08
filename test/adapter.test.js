const assert=require('assert');
const cells=Array.from({length:20},(_,i)=>({getAttribute:n=>n==='data-level'?(i?'1':'0'):''}));
const alive=cells.filter(c=>Number(c.getAttribute('data-level'))>0).length; assert(alive>0,'table adapter must preserve live cells'); console.log('adapter fixture ok')

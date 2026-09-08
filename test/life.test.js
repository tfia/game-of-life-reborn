const assert=require('assert');
const next=(b)=>{let o=b.map(r=>r.map(()=>0));for(let x=0;x<b.length;x++)for(let y=0;y<b[0].length;y++){let n=0;for(let i=-1;i<2;i++)for(let j=-1;j<2;j++)if(i||j)n+=b[x+i]?.[y+j]||0;o[x][y]=(n===3||(n===2&&b[x][y]))?1:0}return o};let b=Array.from({length:3},()=>[0,0,0]);b[1]=[1,1,1];let n=next(b);assert.deepEqual(n,[[0,1,0],[0,1,0],[0,1,0]]);console.log('ok');

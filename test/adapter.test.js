const assert=require('assert');
function findCalendar(root){return root.querySelector('[data-testid="contribution-graph"], .js-yearly-contributions, .ContributionCalendar')}
const d={querySelector:s=>s.includes('data-testid')?{}:null}; assert(findCalendar(d)); console.log('adapter fixture ok')

const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

if(code.includes('EventBus')) {
  console.log('T2: EventBus present.');
} else {
  console.log('T2 missing.');
}

if(code.includes('retries = 3')) {
  console.log('T1: Retries present.');
} else {
  console.log('T1 missing.');
}

if(code.includes('if (!this.isVisible) return;')) {
  console.log('T3: Visibility observer present.');
} else {
  console.log('T3 missing.');
}

if(code.includes('corax_web3_account')) {
  console.log('T4: Web3 persistence present.');
} else {
  console.log('T4 missing.');
}

if(code.includes('themeChanged')) {
  console.log('T5: Theme event bus integration present.');
} else {
  console.log('T5 missing.');
}

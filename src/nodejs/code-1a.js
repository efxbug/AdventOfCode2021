const fs = require('fs');

const input = fs.readFileSync('./input/input-1.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
let last = null;
let increments = 0;
for (const row of input) {
    if (last !== null && Number(row) > last) {
        increments++;
    }
    last = Number(row) || null;
}
console.log(`Found ${increments} increments`);
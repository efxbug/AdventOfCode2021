const fs = require('fs');

const input = fs.readFileSync('./input/input-1.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
let window;
let sum = null;
let increments = 0;
const max = input.length;
for (let i = 0; i < max; i++) {
    window = [Number(input[i]), Number(input[i + 1]), Number(input[i + 2])];
    if (Number.isNaN(window[0]) || Number.isNaN(window[1]) || Number.isNaN(window[2])) {
        //cannot sum
        break;
    } else {
        const newSum = window[0] + window[1] + window[2];
        if (sum !== null && newSum > sum) {
            increments++;
        }
        // console.log(`Analyzing window ${JSON.stringify(window)}, sum=${newSum} (previous=${sum}), increments=${increments}`);
        sum = newSum;
    }
}
console.log(`Found ${increments} increments`);
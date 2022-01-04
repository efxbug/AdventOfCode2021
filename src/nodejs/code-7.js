const fs = require('fs');

const debugLength = 50;
const debugStruct = {};
const printArrayThreshold = 10;

function readInputFile(useSample) {
    const inputFileName = `./input/input${useSample ? '-sample' : ''}-7.txt`;
    return fs.readFileSync(inputFileName, { encoding: 'utf8', flag: 'r' }).split(',').filter(value => value);
}
function debug(...args) {
    if (debugStruct.messages === undefined) {
        debugStruct.messages = 0;
    }
    if (debugStruct.messages < debugLength) {
        console.info(...args);
        debugStruct.messages++;
    }
}
function printArray(name, values) {
    return `${name}=${(values.length > printArrayThreshold) ? values.length : `[${values}]`}`;
}
function convertInputToNumbers(input) {
    return input.map(value => Number(value));
}
function calculateCost(positions, position) {
    let cost = 0;
    positions.forEach(el => {
        // cost += Math.abs(el - position);
        //sum of n natural numbers is n(n+1)/2
        const d = Math.abs(el - position);
        cost += d * (d + 1) / 2;
    });
    return cost;
}
function game(input) {
    const positions = convertInputToNumbers(input);
    console.log(`Converted positions ${input}\ninto numbers: ${positions}`);
    //Start game, find starting min and max position
    let min, max;
    positions.forEach(pos => {
        if (min === undefined || pos < min) {
            min = pos;
        } else if (max === undefined || pos > max) {
            max = pos;
        }
    });
    console.log(`Min=${min}, max=${max}`);
    const result = {
        position: null,
        cost: 0
    };
    for (let i = min; i < max; i++) {
        const cost = calculateCost(positions, i);
        // console.log(`Cost with positions ${positions} at pos=${i} is ${cost}`);
        if (result.position === null || cost < result.cost) {
            result.position = i;
            result.cost = cost;
        }
    }
    return result;
}

(function () {
    const useSample = false;
    const result = game(readInputFile(useSample));
    console.log(`Best aligment is ${JSON.stringify(result)}`);
})();
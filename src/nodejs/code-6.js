const fs = require('fs');

const debugLength = 50;
const debugStruct = {};
const printArrayThreshold = 10;

function readInputFile(useSample) {
    const inputFileName = `./input/input${useSample ? '-sample' : ''}-6.txt`;
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
function createDaysArray(input, maxValue) {
    const days = [];
    for (let i = 0; i <= maxValue; i++) {
        days[i] = 0;
    }
    // console.log(`Days array: ${days} with maxValue ${maxValue}`);
    input.forEach(element => {
        days[element]++;
        // console.log(`Days array after element ${element}: ${days}`);
    });
    return days;
}
function evolve(days) {
    let moving = 0;
    for (let i = days.length - 1; i >= 0; i--) {
        // console.log(`Iteration, i=${i}, moving = ${moving}`);
        //get fishes at day i
        const fishes = days[i];
        //move the fishes from day i+1 here
        days[i] = moving;
        //put the fishes in moving
        moving = fishes;
    }
    //last moving represents the fishes at 0, so we have to move them to day 6 and create some newborn
    days[6] += moving;
    days[8] = moving;
}
function countFishes(days) {
    let sum = 0;
    days.forEach(fishes => sum += fishes);
    return sum;
}
function game(input, iterations) {
    //Start game, create days array
    console.log(`Starting game with input=${input}`);
    const days = createDaysArray(input, 8);
    console.log(`Starting fishes per age array: ${days}`);
    for (let i = 0; i < iterations; i++) {
        evolve(days);
        // console.log(`Fishes per age after day ${i}: ${days}`);
    }
    //count fishes
    return countFishes(days);
}

(function () {
    const useSample = false;
    const days = 256;
    const result = game(readInputFile(useSample), days);
    console.log(`After ${days} day(s), we have a total of ${result} lanternfish(es)`);
})();
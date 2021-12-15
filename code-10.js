const fs = require('fs');
const { exit } = require('process');

const debugLength = 50;
const debugStruct = {};
const printArrayThreshold = 10;

function readInputFile(useSample) {
    const inputFileName = `./input${useSample ? '-sample' : ''}-10.txt`;
    return fs.readFileSync(inputFileName, { encoding: 'utf8', flag: 'r' }).split('\n').filter(value => value);
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

class Sym {
    constructor(start, stop, errorScore, incompleteScore) {
        this.start = start;
        this.stop = stop;
        this.errorScore = errorScore;
        this.incompleteScore = incompleteScore;
    }
}

const symbols = [
    new Sym('(', ')', 3, 1),
    new Sym('[', ']', 57, 2),
    new Sym('{', '}', 1197, 3),
    new Sym('<', '>', 25137, 4),
];
function createSymbolsMap() {
    const result = new Map();
    symbols.forEach(sym => {
        result.set(sym.start, sym.stop);
    });
    return result;
}
function createErrorScoreMap() {
    const result = new Map();
    symbols.forEach(sym => {
        result.set(sym.stop, sym.errorScore);
    });
    return result;
}
function createIncompleteScoreMap() {
    const result = new Map();
    symbols.forEach(sym => {
        result.set(sym.start, sym.incompleteScore);
    });
    return result;
}
const errorScoreMap = createErrorScoreMap();
const incompleteScoreMap = createIncompleteScoreMap();
function checkRow(row, useErrors) {
    //replace all single couples
    let lastLength = 0;
    let str = row;
    //reduce string to the minimum
    while (lastLength !== str.length) {
        lastLength = str.length;
        str = str.replaceAll(/(\(\))|(\[\])|(<>)|({})/g, '');
    }
    // console.log(`Starting from '${row}' we got '${str}'`);
    let result = 0;
    if (str && str.length > 0) {
        //check for any closing chars to find a syntax error (not incomplete)
        const match = str.match(/\)|\]|}|>/);
        if (match) {
            //Syntax error
            if (useErrors) {
                // console.log(`Match ${JSON.stringify(match)}`);
                result = errorScoreMap.get(match[0]);
            }
        } else {
            //Incomplete string
            if (!useErrors) {
                //use incompleteScore, find the closing tags
                for (let i = str.length - 1; i >= 0; i--) {
                    result = (result * 5) + incompleteScoreMap.get(str[i]);
                    // console.log(`New score after ${str[i]}(${incompleteScoreMap.get(str[i])}) = ${result}`);
                }
            }
        }
    }
    return result;
}
function game(input, firstPart) {
    let score = 0;
    const scores = [];
    for (const row of input) {
        const res = checkRow(row, firstPart);
        if (firstPart) {
            score += res;
        } else {
            if (res > 0) {
                scores.push(res);
            }
        }
    }
    if (!firstPart) {
        const sorted = scores.sort((a, b) => a - b);
        // console.log(`Scores: [\n  ${sorted.join('\n  ')}\n]`);
        score = sorted[Math.floor(scores.length / 2)];
    }
    return score;
}

(function () {
    const useSample = false;
    const firstPart = false;
    const result = game(readInputFile(useSample, firstPart));
    console.log(`Syntax error score: ${result}`);
})();
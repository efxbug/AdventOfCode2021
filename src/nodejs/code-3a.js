const fs = require('fs');

const input = fs.readFileSync('./input/input-3.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
const oneOccurencesArray = [];
let valueLength;
let values = 0;
for (const value of input) {
    if (value) {
        values++;
        if (valueLength === undefined) {
            valueLength = value.length;
        }
        for (let i = 0; i < valueLength; i++) {
            const counter = oneOccurencesArray[i];
            if (value[i] == 1) {
                if (counter === undefined) {
                    oneOccurencesArray[i] = 1;
                } else {
                    oneOccurencesArray[i]++;
                }
            }
        }
    }
}
//Compute gamma and epsilon
let gammaString = '', epsilonString = ''
for (const value of oneOccurencesArray) {
    if (value && Number(value) > (values / 2)) {
        gammaString += '1';
        epsilonString += '0';
    } else {
        gammaString += '0';
        epsilonString += '1';
    }
}
const mul = Number.parseInt(gammaString, 2) * Number.parseInt(epsilonString, 2);
console.log(`Results: stats=${JSON.stringify(oneOccurencesArray)}, length=${values}, g=${gammaString}, e=${epsilonString}, mul=${mul}`);
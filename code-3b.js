const fs = require('fs');

const input = fs.readFileSync('./input-3.txt', { encoding: 'utf8', flag: 'r' }).split('\n').filter(value => value);
function countOnes(values, position) {
    let result = 0;
    for (const value of values) {
        if (value[position] == 1) {
            result++;
        }
    }
    return result;
}
const debugStruct = {};
function debug(...args) {
    if (debugStruct.messages === undefined) {
        debugStruct.messages = 0;
    }
    if (debugStruct.messages < 1010) {
        console.info(...args);
        debugStruct.messages++;
    }
}
function printArray(name, values) {
    return `${name}=${(values.length > 13) ? values.length : `[${values}]`}`;
}
//Compute oxygen and co2
let oxygens = [...input], co2s = [...input];
const valueLength = input[0].length;
for (let i = 0; i < valueLength; i++) {
    const newOx = [];
    const newCo2 = [];
    const oxValue = (countOnes(oxygens, i) >= (oxygens.length / 2)) ? '1' : '0';
    const coValue = (countOnes(co2s, i) >= (co2s.length / 2)) ? '0' : '1';
    let message = `Bit ${i}, oxValue=${oxValue}, coValue=${coValue}`;
    message += `, ${printArray('startingOx', oxygens)}, ${printArray('startingCo2', co2s)}`;
    if (oxygens.length > 1) {
        for (const ox of oxygens) {
            if (ox[i] === oxValue) {
                newOx.push(ox);
            }
        }
        //if no numbers made it through, take the last one
        if (newOx.length < 1) {
            oxygens = oxygens.slice(-1);
        } else {
            oxygens = newOx;
        }
        message += `, ${printArray('newOx', newOx)}, ${printArray('oxygens', oxygens)}`;
    }
    if (co2s.length > 1) {
        for (const co of co2s) {
            if (co[i] === coValue) {
                newCo2.push(co);
            }
        }
        //if no numbers made it through, take the last one
        if (newCo2.length < 1) {
            co2s = co2s.slice(-1);
        } else {
            co2s = newCo2;
        }
        message += `, ${printArray('newCo2', newCo2)}, ${printArray('co2s', co2s)}`;
    }
    debug(message);
}
//We should have only one and exactly one number in every array
if (oxygens.length === 1 && co2s.length === 1) {
    const oxygen = Number.parseInt(oxygens[0], 2);
    const co2 = Number.parseInt(co2s[0], 2);
    const lifeSupport = oxygen * co2;
    console.log(`Life support from oxygen ${oxygen} and co2 ${co2} = ${lifeSupport}`);
} else {
    console.error('Too many numbers', oxygens, co2s);
}
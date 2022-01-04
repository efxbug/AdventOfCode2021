const fs = require('fs');
const { exit } = require('process');

const debugLength = 50;
const debugStruct = {};
const printArrayThreshold = 10;

function readInputFile(useSample) {
    const inputFileName = `./input/input${useSample ? '-sample' : ''}-8.txt`;
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
function convertInputToNumbers(input) {
    return input.map(value => Number(value));
}
const numbers = [
    'abcefg', //0 => (6) incl. 1, 7, no 4
    'cf', //1
    'acdeg', //2 => (5) no 1,7,4
    'acdfg', //3 => (5) includes 1, 7, no 4
    'bcdf', //4 
    'abdfg', //5 => (5) no 1,7,4
    'abdefg', //6 => (6) incl. 5, no 1, 3, 4, 7
    'acf', //7
    'abcdefg', //8 => (7)
    'abcdfg', //9 => (6) incl. 1, 7, 4
];
const correspondanceMap = {
    0: {
        length: 6,
        includes: [1, 7],
        excludes: [4]
    },
    1: {
        length: 2,
    },
    2: {
        length: 5,
        excludes: [1, 7, 4],
        after: [5]
    },
    3: {
        length: 5,
        includes: [1, 7],
    },
    4: {
        length: 4
    },
    5: {
        length: 5,
        excludes: [1, 7, 4],
        includedIn: [6],
    },
    6: {
        length: 6,
        excludes: [1, 3, 4, 7]
    },
    7: {
        length: 3,
    },
    8: {
        length: 7,
    },
    9: {
        length: 6,
        includes: [1, 4, 7]
    }
}
function computeLengthMap() {
    const lengthMap = [];
    numbers.forEach(num => {
        if (lengthMap[num.length] === undefined) {
            lengthMap[num.length] = 1;
        } else {
            lengthMap[num.length]++;
        }
    });
    // console.log(`LengthMap for ${numbers} => ${lengthMap}`);
    return lengthMap;
}
function countUniqueSignals(outputs, lengthMap) {
    //first part, only count unique signals
    let count = 0;
    for (const output of outputs) {
        // console.log(`Checking ${output} length(${output.length}) against ${lengthMap[output.length]}`);
        if (lengthMap[output.length] === 1) {
            count++;
        }
    }
    // console.log(`Count for ${outputs} = ${count}`);
    return count;
}
function isIncluded(pattern, patternToCheck) {
    if (patternToCheck.length < pattern.length) {
        return false;
    }
    //ok check if the pattern is included
    for (const letter of pattern) {
        if (!patternToCheck.includes(letter)) {
            return false;
        }
    }
    return true;
}
function isAfter(mapping, after) {
    for (const af of after) {
        if (!mapping[af]) {
            return false;
        }
    }
    return true;
}
function isIncludedIn(pattern, mapping, includedIn) {
    //ok check if the pattern is included in every includedIn
    for (const inclIn of includedIn) {
        const map = mapping[inclIn];
        if (!map || !isIncluded(pattern, map)) {
            return false;
        }
    }
    return true;
}
function findMapping(patterns) {
    const mapping = {};
    const missingPatterns = [...patterns];
    //map every pure length
    let oldLength, counter = 0;
    while (missingPatterns.length > 0) {
        if (oldLength === missingPatterns.length) {
            //too bad, retry
            if (++counter > 1) {
                console.warn(`Infinite loop detected`);
                break;
            }
        } else {
            counter = 0;
            oldLength = missingPatterns.length;
        }
        for (const idx in correspondanceMap) {
            const corr = correspondanceMap[idx];
            if (mapping[idx] === undefined) {
                // console.log(`Check mapping for ${JSON.stringify(corr)}`);
                //find correspondances
                if (corr.includes) {
                    //check for the included values
                    let match;
                    for (const pattern of missingPatterns) {
                        if (pattern.length === corr.length) {
                            // console.log(`Pattern ${pattern} could be a match for ${JSON.stringify(corr)}`);
                            for (const incl of corr.includes) {
                                const map = mapping[incl];
                                if (map && isIncluded(map, pattern)) {
                                    match = true;
                                } else {
                                    match = false;
                                    break;
                                }
                            }
                            if (match && corr.excludes) {
                                for (const incl of corr.excludes) {
                                    const map = mapping[incl];
                                    if (map && !isIncluded(map, pattern)) {
                                        match = true;
                                    } else {
                                        match = false;
                                        break;
                                    }
                                }
                            }
                            if (match) {
                                //found!
                                mapping[idx] = pattern;
                                //remove the element
                                missingPatterns.splice(missingPatterns.indexOf(pattern), 1);
                                //break, correspondance found
                                break;
                            }
                        }
                    }
                } else if (corr.excludes) {
                    if (!corr.after || isAfter(mapping, corr.after)) {
                        //either no after was specified  or the mapping was already found
                        for (const pattern of missingPatterns) {
                            if (corr.length === pattern.length) {
                                let match;
                                if (!corr.includedIn || isIncludedIn(pattern, mapping, corr.includedIn)) {
                                    //check for exclusion
                                    for (const incl of corr.excludes) {
                                        const map = mapping[incl];
                                        if (map && !isIncluded(map, pattern)) {
                                            match = true;
                                        } else {
                                            match = false;
                                            break;
                                        }
                                    }
                                    if (match) {
                                        //found!
                                        mapping[idx] = pattern;
                                        //remove the element
                                        missingPatterns.splice(missingPatterns.indexOf(pattern), 1);
                                        //break, correspondance found
                                        break;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    //length only
                    for (const p of missingPatterns) {
                        if (p.length === corr.length) {
                            //found
                            mapping[idx] = p;
                            //remove the element
                            missingPatterns.splice(missingPatterns.indexOf(p), 1);
                            //break, correspondance found
                            break;
                        }
                    }
                }
            }
        }
    }
    return mapping;
}
function sortString(string) {
    return string.split('').sort().join('');
}
function createOrderedDictionary(mappings) {
    const result = {};
    for (const key in mappings) {
        result[sortString(mappings[key])] = key;
    }
    return result;
}
function getOutput(outputs, mappings) {
    let resultString = '';
    const dictionary = createOrderedDictionary(mappings);
    for (const o of outputs) {
        const value = dictionary[sortString(o)];
        if (value === undefined) {
            console.error('Value not found in dictionary!!!');
            exit(-1);
        }
        resultString += value;
    }
    return resultString;
}
function game(input) {
    //Start game, find starting min and max position
    // const lengthMap = computeLengthMap();
    let count = 0;
    for (const row of input) {
        const readings = row.split('|');
        // console.log(`Readings for input ${row}: ${JSON.stringify(readings)}`);
        const patterns = readings[0].trim().split(/\s+/);
        const outputs = readings[1].trim().split(/\s+/);
        //first part
        // count += countUniqueSignals(outputs, lengthMap);
        //second part
        const mappings = findMapping(patterns);
        const output = getOutput(outputs, mappings);
        count += Number(output);
    }
    return count;
}

(function () {
    const useSample = false;
    const result = game(readInputFile(useSample));
    console.log(`Sum of every reading is ${result}`);
})();
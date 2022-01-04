const fs = require('fs');
const { exit } = require('process');

const debugLength = 50;
const debugStruct = {};
const printArrayThreshold = 10;

function readInputFile(useSample) {
    const inputFileName = `./input/input${useSample ? '-sample' : ''}-9.txt`;
    return fs.readFileSync(inputFileName, { encoding: 'utf8', flag: 'r' }).split('\n').filter(value => value).map(value => value.split(''));
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
    // console.log(`Converting value map ${JSON.stringify(input)} to numbers...`);
    return input.map(row => row.map(value => {
        const num = Number(value);
        if (isNaN(num)) {
            console.log(`Parsing error: cannot conver "${value}" to number`);
            exit(-1);
        }
        return num;
    }));
}
function sortString(string) {
    return string.split('').sort().join('');
}
function findInBasin(x, y, basin) {
    for (const p of basin) {
        if (x === p.x && y === p.y) {
            // console.log(`Point ${x}, ${y} found in basin ${JSON.stringify(basin)}`);
            return true;
        }
    }
    // console.log(`Point ${x}, ${y} NOT found in basin ${JSON.stringify(basin)}`);
    return false;
}
function computeBasin(depths, x, y, maxX, maxY, basin) {
    // console.log(`Computing basin for ${x},${y}, value = ${depths[y][x]}`);
    if (!findInBasin(x, y, basin) && depths[y][x] !== 9) {
        //save x,y in the basin
        basin.push({
            x,
            y
        });
        //start from x,y and try to check the basin on the 4 directions
        if (x > 0) {
            computeBasin(depths, x - 1, y, maxX, maxY, basin);
        }
        if (x < maxX) {
            computeBasin(depths, x + 1, y, maxX, maxY, basin);
        }
        if (y > 0) {
            computeBasin(depths, x, y - 1, maxX, maxY, basin);
        }
        if (y < maxY) {
            computeBasin(depths, x, y + 1, maxX, maxY, basin);
        }
    }
}
function game(input) {
    //Start game, find starting min and max position
    const depths = convertInputToNumbers(input);
    // console.log(`Depths map is ${JSON.stringify(depths)}`);
    const lowPoints = [];
    const depthRows = depths.length;
    const lastDepth = depthRows - 1;
    const basins = [];
    for (let i = 0; i < depthRows; i++) {
        const row = depths[i];
        const rowLength = row.length;
        const last = row.length - 1;
        for (let j = 0; j < rowLength; j++) {
            const value = row[j];
            if (i > 0) {
                //check upper position
                if (depths[i - 1][j] <= value) {
                    //not a low point
                    continue;
                }
            }
            if (j > 0) {
                //check left
                if (row[j - 1] <= value) {
                    //not a low point
                    continue;
                }
            }
            if (j < last) {
                //check right
                if (row[j + 1] <= value) {
                    //not a low point
                    continue;
                }
            }
            if (i < lastDepth) {
                //check lower position
                if (depths[i + 1][j] <= value) {
                    //not a low point
                    continue;
                }
            }
            //If we are here, we found a low point
            //calculate basin
            // console.log(`Compute basin for low point ${j},${i}`);
            const basin = [];
            computeBasin(depths, j, i, last, lastDepth, basin);
            basins.push(basin);
            lowPoints.push({
                x: j,
                y: i,
                value: value
            });
        }
    }
    //calculate low points score (part 1)
    // let score = 0;
    // for (const lp of lowPoints) {
    //     score += (lp.value + 1);
    // }
    // return score;
    //calculate basins score (part 2)
    let score = 1;
    basins.sort((a, b) => -(a.length - b.length));
    // console.log(`Basins: ${JSON.stringify(basins)}`);
    for (let i = 0; i < Math.min(basins.length, 3); i++) {
        score *= basins[i].length;
    }
    return score;
}

(function () {
    const useSample = false;
    const result = game(readInputFile(useSample));
    console.log(`Basins score: ${result}`);
})();
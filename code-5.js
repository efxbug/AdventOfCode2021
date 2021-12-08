const fs = require('fs');
const { exit } = require('process');

const debugLength = 50;
const debugStruct = {};
const printArrayThreshold = 10;

function readInputFile(useSample) {
    const inputFileName = `./input${useSample ? '-sample' : ''}-5.txt`;
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
function readSegments(input) {
    const segments = [];
    for (const row of input) {
        if (row) {
            segments.push(row.split(/\s+->\s+/).map(value => {
                const p = value.split(',');
                return {
                    x: Number(p[0]),
                    y: Number(p[1]),
                };
            }));
        }
    }
    return segments;
}
function getPointString(point) {
    return `(${point.x}, ${point.y})`;
}
function getSegmentString(segment) {
    return `${getPointString(segment[0])}=>${getPointString(segment[1])}`;
}
function printSegments(segments) {
    return `Segments: \n${segments.map(seg => getSegmentString(seg)).join('\n')}`;
}
function computeDimensions(segments) {
    let xMax = 0, yMax = 0;
    segments.forEach(s => {
        const x = Math.max(Number(s[0].x), Number(s[1].x));
        const y = Math.max(Number(s[0].y), Number(s[1].y));
        if (x > xMax) {
            xMax = x;
        }
        if (y > yMax) {
            yMax = y;
        }
    });
    return {
        x: xMax + 1,
        y: yMax + 1
    }
}
function drawSegment(map, segment, crosses) {
    const x0 = segment[0].x;
    const x1 = segment[1].x;
    const y0 = segment[0].y;
    const y1 = segment[1].y;
    if (x0 === x1) {
        //vertical
        const startY = Math.min(y0, y1);
        const endY = (startY === y0) ? y1 : y0;
        const x = x0;
        for (let i = startY; i <= endY; i++) {
            let row = map[i];
            if (!row) {
                row = map[i] = [];
            }
            row[x] = (row[x] && row[x] !== '.') ? row[x] + 1 : 1;
        }
        // console.log(`Drawing Segment ${getSegmentString(segment)} x=${x} y=${startY}-${endY}`);
    } else if (y0 === y1) {
        //horizontal
        const startX = Math.min(x0, x1);
        const endX = (startX === x0) ? x1 : x0;
        const y = y0;
        let row = map[y];
        if (!row) {
            row = map[y] = [];
        }
        for (let i = startX; i <= endX; i++) {
            row[i] = (row[i] && row[i] !== '.') ? row[i] + 1 : 1;
        }
        // console.log(`Drawing Segment ${getSegmentString(segment)}, x=${startX}-${endX}, y=${y}`);
    } else {
        const dx = x1 - x0;
        const dy = y1 - y0;
        if (!crosses && (Math.abs(dx) === Math.abs(dy))) {
            // console.log(`Drawing 45° Segment ${getSegmentString(segment)}, x=${x0}-${x1}, y=${y0}-${y1}`);
            const d = Math.abs(dx);
            const xIncr = x0 > x1 ? -1 : 1;
            const yIncr = y0 > y1 ? -1 : 1;
            for (let i = 0, x = x0, y = y0; i <= d; i++, x += xIncr, y += yIncr) {
                const value = map[y][x];
                map[y][x] = (value && value !== '.') ? value + 1 : 1;
                // console.log(`Drawing point ${x},${y}`);
            }
        } else {
            console.error(`Diagonals not supported, Segment ${getSegmentString(segment)}, dx=${dx}, dy=${dy}`);
        }
    }
}
function drawAllSegments(segments, crosses) {
    const dim = computeDimensions(segments);
    console.log(`Creating map with dimensions: ${dim.x}x${dim.y}`);
    const map = [];
    for (let i = 0; i < dim.y; i++) {
        map[i] = [];
        for (let j = 0; j < dim.x; j++) {
            map[i][j] = '.';
        }
    }
    for (const seg of segments) {
        drawSegment(map, seg, crosses);
    }
    return map;
}
function printMap(map) {
    return `[\n\t${map.map(row => {
        return (row.join('') || []);
    }).join('\n\t')}\n]`;
}
function findOverlap(map, atLeastValue) {
    const overlap = atLeastValue || 0;
    let result = 0;
    for (const row of map) {
        if (row) {
            for (const value of row) {
                if (value && value > overlap) {
                    result++;
                }
            }
        }
    }
    return result;
}

(function () {
    const useSample = false;
    const segments = readSegments(readInputFile(useSample));
    const map = drawAllSegments(segments);
    const overlapValue = 1;
    console.log(`${useSample ? printSegments(segments) : 'Segments: [...]'}\nMap: ${useSample ? printMap(map) : '[...]'}\nOverlap(${overlapValue})=${findOverlap(map, overlapValue)}`);
})();
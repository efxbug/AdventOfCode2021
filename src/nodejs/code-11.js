const { genericMain, printArray, readInputMatrix, whiteForeground, greenForeground } = require('./generic');

function incrementCell(matrix, x, y, flashed) {
    try {
        const value = matrix[x][y];
        if (!flashed[x][y]) {
            if (value < 9) {
                matrix[x][y]++;
            } else {
                flash(matrix, x, y, flashed);
            }
        }
    } catch (error) {
        throw error;
    }
}

function flash(matrix, x, y, flashed) {
    //flash the requested cell
    matrix[x][y] = 0;
    flashed[x][y] = true;
    const xmin = Math.max(x - 1, 0);
    const xmax = Math.min(x + 2, matrix.length);
    for (let i = xmin; i < xmax; i++) {
        const row = matrix[x];
        const ymin = Math.max(y - 1, 0);
        const ymax = Math.min(y + 2, row.length);
        for (let j = ymin; j < ymax; j++) {
            if (x === i && y == j) {
                //Skipping, same cell
            } else {
                incrementCell(matrix, i, j, flashed);
            }
        }
    }
}

function createFlashedMatrix(matrix) {
    return matrix.map(r => r.map(v => false));
}

function game(useSample, part) {
    let score = 0;
    //read input matrix
    const matrix = readInputMatrix(useSample).map(row => row.map(str => Number(str)));
    const numIterations = (part === 0) ? 100 : 1000;
    // console.log(printArray('Input array', matrix));
    for (let n = 0; n < numIterations; n++) {
        //create empty flashed matrix
        const flashed = createFlashedMatrix(matrix);
        //increase all energy levels and flash if needed
        matrix.forEach((row, rowIdx) => row.forEach((_, octopusIdx) => {
            incrementCell(matrix, rowIdx, octopusIdx, flashed);
        }));
        //Check flashed result by flattening the flashed matrix
        let count = 0;
        const flashedFlat = flashed.flat();
        const total = flashedFlat.length;
        flashedFlat.forEach(flash => {
            if (flash) {
                count++;
            }
        });
        if (part === 0) {
            score += count;
        } else {
            if (count === total) {
                score = n + 1;
                break;
            }
        }
    }
    console.log(printArray('After iteration ' + numIterations, matrix, 0, value => value === 0 ? whiteForeground(value) : value));
    return score;
}

(function () {
    genericMain(game);
})();
const fs = require('fs');

const boardLength = 5;
const useSample = false;
const inputFileName = `./input${useSample ? '-sample' : ''}-4.txt`;
const debugLength = 50;
const debugStruct = {};
const printArrayThreshold = 10;
const MARK = '*';

function readInputFile() {
    return fs.readFileSync(inputFileName, { encoding: 'utf8', flag: 'r' }).split('\n').filter(value => value);
}
function countOnes(values, position) {
    let result = 0;
    for (const value of values) {
        if (value[position] == 1) {
            result++;
        }
    }
    return result;
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
function readBoard(input, startLine) {
    const board = [];
    const limit = startLine + boardLength;
    if (limit > input.length) {
        return;
    }
    for (let i = startLine; i < startLine + boardLength; i++) {
        const value = input[i];
        if (value) {
            const row = value.trim().split(/\s+/);
            // console.log(printArray('=======ROW======>', row));
            board.push(row);
        } else return;
    }
    // console.log('Read board ' + getBoardString(board));
    return board;
}
function readBingo(input) {
    const draws = input[0].split(',');
    const boards = [];
    for (let i = 1; i < input.length; i++) {
        const value = input[i];
        if (value) {
            //read board
            const board = readBoard(input, i);
            if (board) {
                boards.push(board);
                i += 4;
            }
        }
    }
    return {
        draws,
        boards
    }
}
function getBoardString(board) {
    const rows = [];
    for (const row of board) {
        rows.push(row.join(', '));
    }
    return `[\n\t[ ${rows.join(' ]\n\t[ ')} ]\n]`;
}
function printBingo(bingo) {
    return `Bingo: \nDraws: [${bingo.draws.join(', ')}]\nBoards:\n${bingo.boards.map(board => getBoardString(board)).join('\n')}`;
}
function markBoard(board, draw) {
    let marked = false;
    for (const row of board) {
        for (let i = 0; i < row.length; i++) {
            if (row[i] === draw) {
                row[i] += MARK;
                marked = true;
            }
        }
    }
    return marked;
}
function checkBoardForWinner(board) {
    //Check rows
    for (const row of board) {
        if (row.filter(value => value.includes(MARK)).length === row.length) {
            //FOUND A WINNING ROW!!!
            return true;
        }
    }
    //Check columns (slow)
    const length = board[0].length; //take the length of the first row
    for (let i = 0; i < length; i++) {
        let found = 0;
        for (let j = 0; j < board.length; j++) {
            if (board[j][i].includes(MARK)) {
                found++;
            } else {
                break;
            }
        }
        if (found === board.length) {
            //Found a winning column!!!
            return true;
        }
    }
}
function game(bingo, maxDraws, waitForLastWinner) {
    let draws = 0;
    let lastWinner;
    const winnerBoards = [];
    console.log('Game start');
    for (const draw of bingo.draws) {
        draws++;
        if (Number(maxDraws) > 0 && draws > maxDraws) {
            console.log('Max draws reached, end of game');
            break;
        } else {
            console.log(`${draw} has been drawn!!!`);
            let found = false;
            for (let i = 0; i < bingo.boards.length; i++) {
                const board = bingo.boards[i];
                if (!waitForLastWinner || !winnerBoards.includes(i)) {
                    if (markBoard(board, draw)) {
                        found = true;
                        console.log(`Board ${i} marked`);
                        if (checkBoardForWinner(board)) {
                            const winner = {
                                winner: i,
                                board: board,
                                lastDraw: draw
                            }
                            if (waitForLastWinner) {
                                lastWinner = winner;
                                winnerBoards.push(i);
                            } else {
                                return winner;
                            }
                        }
                    }
                }
            }
            console.log(`${draw} ${found ? '' : 'NOT '}found`);
        }
    }
    return lastWinner;
}
function calculateScore(gameResult) {
    let sum = 0;
    gameResult.board.forEach(row => row.forEach(value => {
        if (!value.includes(MARK)) {
            sum += Number(value.replace(/\*+/, ''));
        }
    }));
    console.log(`Sum of board ${getBoardString(gameResult.board)} is ${sum}, draw was ${gameResult.lastDraw}`);
    return sum * gameResult.lastDraw;
}

(function () {
    const bingo = readBingo(readInputFile());
    console.log('Start Bingo ', printBingo(bingo));
    const result = game(bingo, undefined, true);
    if (result) {
        //Winner found
        console.log(`Game won by board ${result.winner}\n${getBoardString(result.board)}`);
        console.log(`Score was ${calculateScore(result)}`);
    } else {
        console.log(`Game finished with no winners\n${printBingo(bingo)}`);
    }
})();
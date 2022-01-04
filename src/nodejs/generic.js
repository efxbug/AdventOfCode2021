'use strict'

const fs = require('fs');
const path = require('path');

const debugLength = 50;
const debugStruct = {};
const printArrayThreshold = 10;

function getFileName() {
    return path.parse(process.argv[1]).name;
}

function createTitle(title, subtitle, minWidth = 51, minSpaces = 1, titleDelimiter = '*') {
    let titleWidth = minWidth - 1;
    const tdLength = titleDelimiter.length;
    const doubleTd = tdLength * 2;
    let titleSpaces = 0;
    let subtitleSpaces = 0;
    let titleSpacesRight = 0;
    let subtitleSpacesRight = 0;
    let maxWidth;
    while (titleSpaces < minSpaces || subtitleSpaces < minSpaces || titleSpacesRight < minSpaces || subtitleSpacesRight < minSpaces) {
        titleWidth++;
        maxWidth = titleWidth - doubleTd;
        titleSpaces = Math.round((maxWidth - title.length) / 2);
        subtitleSpaces = Math.round((maxWidth - subtitle.length) / 2);
        titleSpacesRight = titleWidth - doubleTd - titleSpaces - title.length;
        subtitleSpacesRight = titleWidth - doubleTd - subtitleSpaces - subtitle.length;
    }
    return titleDelimiter.repeat(titleWidth) + '\n' +
        titleDelimiter + ' '.repeat(titleSpaces) + title + ' '.repeat(titleSpacesRight) + titleDelimiter + '\n' +
        titleDelimiter + ' '.repeat(subtitleSpaces) + subtitle + ' '.repeat(subtitleSpacesRight) + titleDelimiter + '\n' +
        titleDelimiter.repeat(titleWidth);
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

function printArray(name, values, indent = 0, valueFn = value => value) {
    return `${name ? name + '=' : ''}${(values.length > printArrayThreshold) ? values.length :
        `[${values.map(value => value instanceof Array ?
            '\n' + ' '.repeat(indent + 1) + printArray(null, value, indent + 1, valueFn) : valueFn(value)).join(',')}]`}`;
}

function readInputFile(useSample) {
    //take the input file name from process and replace "code" with input file
    const inputFileName = getFileName().replace('code', `./input/input${useSample ? '-sample' : ''}`) + '.txt';
    return fs.readFileSync(inputFileName, { encoding: 'utf8', flag: 'r' }).split('\n').filter(value => value);
}

function readInputMatrix(useSample, columnSeparator = '') {
    return readInputFile(useSample).map(row => row.split(columnSeparator));
}

function showGenericTitle() {
    console.log(createTitle('Advent of code 2021', getFileName().replace('code-', 'Day ')));
}

function genericMain(gameFunction) {
    showGenericTitle();
    for (let i = 0; i < 4; i++) {
        const useSample = i % 2 == 0;
        const part = (i < 2) ? 0 : 1;
        console.log(`Running ${useSample ? 'sample' : 'game'}, part ${part + 1}`);
        const result = gameFunction(useSample, part);
        console.log(`Result: ${result}`);
    }
}

// returns a colored string based on colorCode, to be prompted on the cli
const coloredPrompt = (colorCode, string) => `\x1b[${colorCode}m${string}\x1b[0m`;

// some utilities to get a colored prompt
const resetColor = string => coloredPrompt(0, string);
const whiteForeground = string => coloredPrompt(37, string);
const yellowForeground = string => coloredPrompt(33, string);
const yellowBackground = string => coloredPrompt(43, '\x1b[30m' + string); // black foreground to increase contrast
const redForeground = string => coloredPrompt(31, string);
const redBackground = string => coloredPrompt(41, string);
const greenForeground = string => coloredPrompt(32, string);
const greenBackground = string => coloredPrompt(42, '\x1b[30m' + string); // black foreground to increase contrast
const magentaForeground = string => coloredPrompt(95, string);

module.exports = {
    debug,
    printArray,
    readInputFile,
    readInputMatrix,
    showGenericTitle,
    genericMain,
    resetColor,
    whiteForeground,
    yellowForeground,
    yellowBackground,
    greenForeground
}
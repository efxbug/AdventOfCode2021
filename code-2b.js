const fs = require('fs');

const input = fs.readFileSync('./input-2a.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
let pos = 0;
let aim = 0;
let depth = 0;
for (const command of input) {
    const cmd = command.split(' ');
    switch (cmd[0]) {
        case 'forward':
            pos += Number(cmd[1]);
            depth += Number(aim * cmd[1]);
            break;
        case 'down':
            aim += Number(cmd[1]);
            break;
        case 'up':
            aim -= Number(cmd[1]);
            break;
    }
}
console.log(`Results: pos=${pos}, depth=${depth}, mul=${pos * depth}`);
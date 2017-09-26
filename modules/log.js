const fs = require('fs');
const date = require('./date');

let logConsole = (data, logArgument) => {
    if(logArgument) {
        console.log(`${date.getDateTime()}   ${data}`);
    }
};

let logFile = (data, logArgument) => {
    if(logArgument) {
        fs.appendFile('log.txt', `${date.getDateTime()}   ${data}\r\n`, (err) => {
            if (err) throw err;
        });
    }
};

let logDB = (data, logArgument) => {
    if(logArgument) {

    }
};

module.exports = {
    logConsole,
    logFile,
    logDB
};
const fs = require('fs');

let logConsole = (data, logArgument) => {
    if(logArgument) {
        console.log(`${getDateTime()}   ${data}`);
    }
};

let logFile = (data, logArgument) => {
    if(logArgument) {
        fs.appendFile('log.txt', `${getDateTime()}   ${data}\r\n`, (err) => {
            if (err) throw err;
        });
    }
};

let logDB = (data, logArgument) => {
    if(logArgument) {

    }
};

function getDateTime() {
    let date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    let sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    let day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return day + "." + month + "." + year + " " + hour + ":" + min + ":" + sec;
}

module.exports = {
    logConsole,
    logFile,
    logDB
};
const fs = require('fs');

let logConsole = (data) => {
    if(app.logging) {console.log(data);}
};

let logFile = (data) => {
    fs.appendFile('log.txt', data, (err) => {
        if (err) throw err;
    })
};

let logDB = (data) => {

};

module.exports = {
    logConsole,
    logFile,
    logDB
};
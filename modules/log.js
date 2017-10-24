const fs = require('fs');
const date = require('./date');
const {Logs} = require('./../db/models/Logs');

class Log {
    constructor(logArgument) {
        this.logArgument = logArgument;
    }

    Console(data) {
        if(this.logArgument) {
            console.log(`${date.getDateTime()}   ${data}`);
        }
    }

    ConsoleJSON(data) {
        if(this.logArgument) {
            console.log(`${date.getDateTime()}`);
            console.log(JSON.stringify(data, undefined, 2));
        }
    }

    File(data) {
        if(this.logArgument) {
            fs.appendFile('log.txt', `${date.getDateTime()}   ${data}\r\n`, (err) => {
                if (err) throw err;
            });
        }
    }

    DB(data) {
        if(this.logArgument) {
            let log = new Logs({data: data});

            log.save().then((value) => {

            }, (err) => {
                console.log(`${date.getDateTime()}   ${err}`);
            }).catch((err) => {
                console.log(`${date.getDateTime()}   ${err}`);
            });
        }
    }

    All(data) {
        this.Console(data);
        this.File(data);
        this.DB(data);
    }
}

module.exports = {
    Log
};
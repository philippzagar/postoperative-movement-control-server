const fs = require('fs');
const date = require('./date');
const sql = require('./sql');

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
            sql.insertQuery(`INSERT INTO log (time, data) VALUES ('${date.getDateTime()}', '${data}')`);
        }
    }
}

module.exports = {
    Log
};
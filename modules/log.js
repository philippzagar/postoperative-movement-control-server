const fs = require('fs');
const date = require('./date');
let mysql = require('mysql');

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
        let con = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'raspberry',
            database : 'dipl'
        });

        con.connect(function(err) {
            if (err) throw err;
            logConsole("Connected!", logArgument);
            let sql = `INSERT INTO log (time, data) VALUES ('${date.getDateTime()}', '${data}')`;
            con.query(sql, function (err, result) {
                if (err) {
                    logConsole("Error happend when processing query");
                    throw err;
                }
                logConsole("1 record inserted", logArgument);
                con.end();
            });
        });
    }
};

module.exports = {
    logConsole,
    logFile,
    logDB
};
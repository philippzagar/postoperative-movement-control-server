const yargs = require('yargs');
const express = require('express');
const log = require('./modules/log');
const date = require('./modules/date');
//let app = express();

const argv = yargs
    .options({
        l: {
            demand: false,
            alias: 'log',
            describe: 'Log everything in the commandline'
        }
    })
    .help()
    .alias('h', 'help')
    .argv;

let logArgument;
argv.l ? logArgument = true : logArgument = false;

let mysql      = require('mysql');
let con = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'raspberry',
    database : 'dipl'
});

con.connect(function(err) {
    if (err) throw err;
    log.logConsole("Connected!", logArgument);
    let sql = `INSERT INTO gyro (time, sensor) VALUES ('${date.getDateTime()}', 1)`;
    con.query(sql, function (err, result) {
        if (err) {
            log.logConsole("Error happend when processing query");
            throw err;
        }
        log.logConsole("1 record inserted", logArgument);
        con.end();
    });
});

log.logDB("This is a Test", logArgument);

/*app.get('/', (req, res) => {
    res.send("Hallo");
    console.log("Inside get funciton");
});


app.listen(3000);*/
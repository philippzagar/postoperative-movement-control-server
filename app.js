const yargs = require('yargs');
const express = require('express');
const date = require('./modules/date');
const sql = require('./modules/sql');
//let app = express();
const Log = require('./modules/log').Log;

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

let log = new Log(logArgument);

sql.insertQuery(`INSERT INTO log (time, data) VALUES ('${date.getDateTime()}', 'Test for the sql function 2')`);

log.Console("test", logArgument);

//log.logDB("This is a Test", logArgument);

/*app.get('/', (req, res) => {
    res.send("Hallo");
    console.log("Inside get funciton");
});


app.listen(3000);*/
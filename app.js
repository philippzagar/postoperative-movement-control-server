const yargs = require('yargs');
const express = require('express');
const log = require('./modules/log');
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

let logArgument = false;
if(argv.l) {
    logArgument = true;
}

log.logFile("Test", logArgument);


/*app.get('/', (req, res) => {
    res.send("Hallo");
    console.log("Inside get funciton");
});

app.listen(3000);*/
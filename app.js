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

let logging = false;
if(argv.l) {
    logging = true;
}

if(logging) {
    log.logConsole("Hallo dies ist ein Test");
}


/*app.get('/', (req, res) => {
    res.send("Hallo");
    console.log("Inside get funciton");
});

app.listen(3000);*/
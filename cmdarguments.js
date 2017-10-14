const yargs = require('yargs');
const {Log} = require('./modules/log');

// Command line arguments parser
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

// Export Log object
module.exports = new Log(argv.l);


const C = require('./../constants');
let mongoose = require('mongoose');
const log = global.log;

if(C.USING_HTL_DB) {
    log.Console("Using HTL DB!");
} else {
    log.Console("Using Raspberry Pi DB!")
}

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${C.DB_USER}:${C.DB_PW}@localhost:27017/${C.DB_AuthSource}?authMechanism=${C.DB_AuthMechanism}`, {
        useMongoClient: true,
    }).then(() => {
        log.Console("Successfully connected to DB!")
    }, (err) => {
        log.Console("Error while connecting to DB!");
        log.ConsoleJSON(err);
    });

module.exports = {mongoose};
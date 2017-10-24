const C = require('../constants');
let mongoose = require('mongoose');
const log = global.log;

if(C.USING_HTL_DB) {
    log.Console("Using HTL DB!");
} else {
    log.Console("Using Raspberry Pi DB!")
}

const url = `mongodb://${C.DB_USER}:${C.DB_PW}@localhost:27017/${C.DB_AuthSource}?authMechanism=${C.DB_AuthMechanism}`;

mongoose.Promise = global.Promise;
mongoose.connect(url, {
        useMongoClient: true,
    }).then(() => {
        log.Console("Successfully connected to DB with Mongoose!")
    }, (err) => {
        log.Console("Error while connecting to DB with Mongoose!");
        log.ConsoleJSON(err);
    });

module.exports = {mongoose};
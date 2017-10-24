const   {MongoClient, ObjectID} = require('server/playground/mongodb'),
        C = require('../constants'),
        log = global.log;

const values = [{
    properties: {
        description: "This is a test 2",
        gyroID: 1
    },
    values: {
        pitch: 2.2345,
        roll: 24.245,
        yaw: -76.53345
    }
}, {
    properties: {
        description: "This is a test 3",
        gyroID: 2
    },
    values: {
        pitch: 2.2345,
        roll: 24.245,
        yaw: -76.53345
    }
}];

// Global Variable that hold the connection
let db = null;

// Connection URL
const url = `mongodb://${C.DB_USER}:${C.DB_PW}@localhost:27017/MyApp?authMechanism=${C.DB_AuthMechanism}`;
// Use connect method to connect to the Server
/*MongoClient.connect(url, function(err, database) {
    if (err) {
        log.Console("Error while connecting to DB!");
        log.ConsoleJSON(err);
        return;
    }

    log.Console("Successfully connected to DB!");

    db = database;

    db.collection("gyro").insertMany(values).then((docs) => {
        log.Console(`Inserted ${docs.ops.length} to the DB!`);
    }).catch((e) => {
        log.Console(e);
    });
});*/

MongoClient.connect(url).then(() => {
    log.Console("Successfully connected to DB!")
}, (err) => {
    log.Console("Error while connecting to DB!");
    log.ConsoleJSON(err);
});

MongoClient.collection("gyro").insertMany(values).then((docs) => {
    log.Console(`Inserted ${docs.ops.length} to the DB!`);
}).catch((e) => {
    log.Console(e);
});

module.exports = {MongoClient};


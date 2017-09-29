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

//const {MongoClient, ObjectID} = require('mongodb');
let mongoose = require('mongoose');

const user = "MyAppUser";
const pw = "12345";
const authMechanism = "SCRAM-SHA-1";
const authSource = "MyApp";

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${user}:${pw}@localhost:27017/MyApp?authMechanism=${authMechanism}`,
    {
        useMongoClient: true,
    }
);

let Member = mongoose.model('Member', {
    first_name: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    under_18: {
        type: Boolean,
        required: true
    },
    birth_year: {
        type: Number,
        minlength: 4,
        default: null
    }
});

let newMember = new Member({
    first_name: "Philipp",
    last_name: "Zagar",
    under_18: false,
    birth_year: 1999
});

newMember.save().then((doc) => {
    log.Console("Saved");
    log.ConsoleJSON(doc);
}, (err) => {
    log.Console("Unable to save!");
    log.ConsoleJSON(err);
});

/*
// Connection URL
const url = `mongodb://${user}:${pw}@localhost:27017/MyApp?authMechanism=${authMechanism}`;
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    if(err) {
        log.Console("Connection to DB failed!");
        return;
    }

    log.Console("Connected correctly to server");


    db.collection("Test").insertOne({
        name: "Philipp",
        last_name: "Zagar"
    }, (err, result) => {
        if(err) {
            log.Console("Couldn't insert the Object!");
        }
        log.ConsoleJSON(result.ops[0]);
        log.Console(result.ops[0]._id.getTimestamp());
    });


    db.collection("Test").find({last_name: "Zagar"}).toArray().then((docs) => {
        log.ConsoleJSON(docs);
        log.Console(docs[0]._id.getTimestamp());
    }, (err) => {
        log.Console("Unable to fetch the data!", err);
    });

    db.collection("Test").find({last_name: "Zagar"}).count().then((count) => {
        log.Console(count);
    }, (err) => {
        log.Console("Unable to fetch the data!", err);
    });

    db.close();
});
*/
//sql.insertQuery(`INSERT INTO log (time, data) VALUES ('${date.getDateTime()}', 'Test for the sql function 2')`);
//log.Console("test", logArgument);
/*app.get('/', (req, res) => {
    res.send("Hallo");
    console.log("Inside get funciton");
});


app.listen(3000);*/
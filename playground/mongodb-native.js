const {MongoClient, ObjectID} = require('mongodb');

const user = "MyAppUser";
const pw = "12345";
const authMechanism = "SCRAM-SHA-1";
const authSource = "MyApp";

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
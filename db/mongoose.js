let mongoose = require('mongoose');

const user = "MyAppUser";
const pw = "12345";
const authMechanism = "SCRAM-SHA-1";
const authSource = "MyApp";

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${user}:${pw}@localhost:27017/MyApp?authMechanism=${authMechanism}`, {
        useMongoClient: true,
    }
);

module.exports = {mongoose};
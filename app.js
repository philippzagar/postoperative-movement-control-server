const yargs = require('yargs');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const date = require('./modules/date');
const sql = require('./modules/sql');
const {Log} = require('./modules/log');

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

let app = express();

let {mongoose} = require('./db/mongoose');
let {Member} = require('./db/models/Member');
let {ObjectID} = require('mongodb');

// Parse body to JSON - Limit set to 50MB - otherwise it throws exception
app.use(bodyParser.json({limit: '50mb'}));

app.post('/members', (req, res) => {
   log.ConsoleJSON(req.body);

   let member = new Member({
       first_name: req.body.first_name,
       last_name: req.body.last_name,
       under_18: req.body.under_18,
       birth_year: req.body.birth_year
   });

   member.save().then((doc) => {
       res.send(doc);
   }, (err) => {
       res.status(400).send(err);
    });
});

app.get('/members', (req, res) => {
   Member.find().then((members) => {
       res.send({members});
   }, (err) => {
       res.status(400).send(err);
   })
});

app.get('/members/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Member.findById(id).then((member) => {
        if (!member) {
            return res.status(404).send();
        }
        res.send({member});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.delete('/members/:id', (req, res) => {
   let id = req.params.id;
   if(!ObjectID.isValid(id)) {
       return res.status(404).send();
   }

   Member.findByIdAndRemove(id).then((member) => {
       if(!member) {
           return res.status(404).send();
       }

       res.send({member});
   }).catch((err) => {
       res.status(400).send();
   })
});

app.patch('/members/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['birth_year']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isInteger(body.birth_year)) {
        let birthDate = new Date();

        birthDate.setDate(1);
        birthDate.setMonth(0);
        birthDate.setFullYear(body.birth_year);

        let actualDate = new Date();
        actualDate.setFullYear(actualDate.getFullYear() - 18);

        birthDate <= actualDate ? body.under_18 = false : body.under_18 = true;

    } else {
        body.under_18 = true;
    }

    Member.findByIdAndUpdate(id, {$set: body}, {new: true}).then((member) => {
        if(!member) {
            return res.status(404).send();
        }

        res.send({member});
    }).catch((e) => {
        res.status(400).send();
    })
});

const {GyroValues} = require('./db/models/GyroValues');

app.post('/gyroValue', (req, res) => {
    log.ConsoleJSON(req.body);

    log.Console("Schedle");

    let gyroValue = new GyroValues(req.body);

    gyroValue.save().then((value) => {
        res.send(value);
    }, (err) => {
        res.status(400).send(err);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.post('/gyroValues', (req, res) => {
    // Print out the JSON Array
    //log.ConsoleJSON(req.body);

    let gyroValues = req.body;

    // Method 1 - Insert with function insertMany() from Mongoose
    /*
    log.Console(date.getMilliTime());

    GyroValues.insertMany(gyroValues).then((values) => {
        log.Console(date.getMilliTime());
        res.send({info: `Inserted ${values.length} Documents!`, values: values});

    }, (err) => {
        return res.status(400).send(err);
    }).catch((err) => {
        return res.status(400).send(err);
    });
    */

    // Method 2 - Insert with native MongoDB Library
    const {MongoClient} = require('mongodb');

    const user = "MyAppUser";
    const pw = "12345";
    const authMechanism = "SCRAM-SHA-1";
    const authSource = "MyApp";

    // Connection URL
    const url = `mongodb://${user}:${pw}@localhost:27017/MyApp?authMechanism=${authMechanism}`;
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        if (err) {
            log.Console("Connection to DB failed!");
            return;
        }

        log.Console("Connected correctly to server");

        log.Console(date.getMilliTime());
        db.collection("gyroTest").insertMany(gyroValues, (err, result) => {
            if (err) {
                log.Console(err);
                return log.Console("Couldn't insert the Object!");
            }

            log.Console(date.getMilliTime());
            res.send(result);
            db.close();
        });


    });

    // Method 3 - Inserting with .save() from Mongoose with for loop
    /*
    let i = 0;

    for(i; i < gyroValues.length; i++) {
        new GyroValues(gyroValues[i]).save().then((value) => {
            //res.send(value);
        }, (err) => {
            return res.status(400).send(err);
        }).catch((err) => {
            return res.status(400).send(err);
        });
    }
    */

    //res.status(200).send({result: `Inserted ${i} Values to DB!`, values:gyroValues});
});

app.get('/gyroValues', (req, res) => {
    GyroValues.find().then((gyroValues) => {
        res.send({gyroValues});
    }, (err) => {
        res.status(400).send(err);
    })
});

app.get('/gyroValue/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    GyroValues.findById(id).then((gyroValue) => {
        if (!gyroValue) {
            return res.status(404).send();
        }
        res.send({gyroValue});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.delete('/gyroValue/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    GyroValues.findByIdAndRemove(id).then((gyroValue) => {
        if(!gyroValue) {
            return res.status(404).send();
        }

        res.send({gyroValue});
    }).catch((err) => {
        res.status(400).send();
    })
});

app.patch('/gyroValue/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['values']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    log.ConsoleJSON(body);

    if(_.isNumber(body.values.pitch) && _.isNumber(body.values.roll) && _.isNumber(body.values.yaw) && body) {
        GyroValues.findByIdAndUpdate(id, {$set: body}, {new: true}).then((gyroValue) => {
            if(!gyroValue) {
                return res.status(404).send();
            }

            res.send({gyroValue});
        }).catch((e) => {
            res.status(400).send();
        })
    } else {
        res.status(400).send({err: "Invalid values!"});
    }
});

app.listen(3000, () => {
    log.Console("Server started!");
});

module.exports = {app};
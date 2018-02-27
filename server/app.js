// npm Packages
const   express = require('express'),
        bodyParser = require('body-parser'),
        _ = require('lodash'),
        favicon = require('serve-favicon'),
        path = require('path'),
        moment = require('moment');

// System Packages
const   http = require('http'),
        https = require('https');

// Constants
const   C = require('./constants');

// Command Line Arguments - Set global log object
const   log = require('./cmdarguments');
global.log = log;

// Self Written Modules
const   date = require('./modules/date'),
        mailTemplate = require('./templates/mail/mailTemplate');

// MongoDB Modules
const   {MongoClient, ObjectID} = require('mongodb'),
        {mongoose} = require('./db/mongoose');

// CORS Middleware
const   cors = require('cors');

// Global Variable that hold the connection
let db = null;
// Create the database connection
MongoClient.connect(C.URL, {
        poolSize: 10
        // other options can go here
    }, (err, database) => {
        if(err) {
            log.Console("Error while connecting to DB!");
            log.ConsoleJSON(err);
            return;
        }

        log.Console("Successfully connected to DB!");
        db = database;
    });

const app = express();

const server = https.createServer({
    key: C.SSL_CERT.key,
    cert: C.SSL_CERT.cert,
    ca: C.SSL_CERT.ca
}, app);
const io = require('socket.io')(server);

// Mongoose Models
const   {Member} = require('./db/models/Member'),
        {User} = require('./db/models/User');
// const {GyroValues} = require('./db/models/GyroValues');

// Middleware
const   {authenticate} = require('./middleware/authenticate'),
        {logMiddleware} = require('./middleware/log');

// Path to public directory
const publicPath = path.join(__dirname, '../client/public');

// Sendgrid
const sg = require('@sendgrid/mail');

// Parse body to JSON - Limit set to 50MB - otherwise it throws exception
app.use(bodyParser.json({limit: '50mb'}));
// Set Favicon
app.use(favicon(__dirname + '/images/favicon.ico'));
// Set Logging Middleware
app.use(logMiddleware);
// Static routes
app.use(express.static(publicPath));
// CORS - expose Header
app.use(cors({'exposedHeaders': ['x-auth']}));

// Express Routes
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

app.post('/gyroValue', authenticate, (req, res) => {
    let gyroValue = req.body;

    // Methode 1 - with Mongoose
    /*
    let gyroValue = new GyroValues(req.body);

    gyroValue.save().then((value) => {
        res.send(value);
    }, (err) => {
        res.status(400).send(err);
    }).catch((err) => {
        res.status(400).send(err);
    });
    */

    let user_id = req.user._id;
    let dbName = "gyroValues-" + user_id;

    db.collection(dbName).insertOne(gyroValue).then((docs) => {
        res.send(docs.ops);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/gyroValues', authenticate, (req, res) => {
    let gyroValues = req.body;

    //Method 1 - Insert with function insertMany() from Mongoose
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
     //Method 2 - Insert with native MongoDB Library
    /*
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
    */
    //Method 3 - Inserting with .save() from Mongoose with for loop
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

    res.status(200).send({result: `Inserted ${i} Values to DB!`, values:gyroValues});
    */

    let user_id = req.user._id;
    let dbName = "gyroValues-" + user_id;

    log.Console(date.getMilliTime());
    db.collection(dbName).insertMany(gyroValues).then((docs) => {
        log.Console(date.getMilliTime());
        res.send(`Inserted ${docs.ops.length} to the DB!`);
        log.Console(`Inserted ${docs.ops.length} to the DB!`);
    }).catch((e) => {
        res.status(400).send(e);
        log.ConsoleJSON(e);
    });
});

app.get('/gyroValues', authenticate,(req, res) => {
    // Methode 1 - with Mongoose
    /*
    GyroValues.find().then((gyroValues) => {
        res.send({gyroValues});
    }, (err) => {
        res.status(400).send(err);
    })
    */

    let user_id = req.user._id;
    let dbName = "gyroValues-" + user_id;

    db.collection(dbName).find({}).toArray().then((docs) => {
        res.send({
            n: docs.length,
            values: docs
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/gyroValue/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // Methode 1 - with Mongoose
    /*
    GyroValues.findById(id).then((gyroValue) => {
        if (!gyroValue) {
            return res.status(404).send();
        }
        res.send({gyroValue});
    }).catch((e) => {
        res.status(400).send();
    })
    */

    let user_id = req.user._id;
    let dbName = "gyroValues-" + user_id;

    db.collection(dbName).findOne({_id: new ObjectID(id)}).then((doc) => {
        if(!doc) {
            return res.status(404).send();
        }
        res.send({value: doc});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/findGyroLastValues/:count', authenticate, (req, res) => {
    const count = parseInt(req.params.count);

    if(!(count > 0)) {
        return res.status(404).send();
    }

    // Methode 1 - with Mongoose
    /*
    GyroValues.findById(id).then((gyroValue) => {
        if (!gyroValue) {
            return res.status(404).send();
        }
        res.send({gyroValue});
    }).catch((e) => {
        res.status(400).send();
    })
    */

    let user_id = req.user._id;
    let dbName = "gyroValues-" + user_id;
    db.collection(dbName).find().sort({ $natural: -1 }).limit(count).toArray().then((docs) => {
        docs = docs.reverse();
        res.send({
            n: docs.length,
            values: docs
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.delete('/gyroValue/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let user_id = req.user._id;
    let dbName = "gyroValues-" + user_id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Methode 1 - with Mongoose
    /*
    GyroValues.findByIdAndRemove(id).then((gyroValue) => {
        if(!gyroValue) {
            return res.status(404).send();
        }

        res.send({gyroValue});
    }).catch((err) => {
        res.status(400).send();
    })
    */

    db.collection(dbName).findOneAndDelete({_id: new ObjectID(id)}).then((doc) => {
        if(!doc.value) {
            return res.status(404).send();
        }
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.patch('/gyroValue/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['values']);

    let user_id = req.user._id;
    let dbName = "gyroValues-" + user_id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Methode 1 - with Mongoose
    /*
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
    */
    if(_.isNumber(body.values.pitch) && _.isNumber(body.values.roll) && _.isNumber(body.values.yaw) && body) {
        db.collection(dbName).findOneAndUpdate({_id: new ObjectID(id)}, {$set: body}).then((doc) => {
            if (!doc) {
                return res.status(404).send();
            }
            res.send(doc);
        }).catch((e) => {
            res.status(400).send(e);
        });
    } else {
        res.status(400).send("Invalid Values!");
    }
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password', 'firstName', 'lastName', 'birth_day', 'birth_month', 'birth_year']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send({
            status: "OK",
            user
        });
    }).catch((e) => {
        res.status(400).send({
            status: "ERROR",
            message: "Failed to create user!",
            error: e
        });
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send({
                status: "OK",
                user
            });
        });
    }).catch((e) => {
        res.status(401).send({
            status: "ERROR",
            message: "Failed to log in!"
        });
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.post('/users/resetpassword', (req, res) => {
    let body = _.pick(req.body, ['email']);
    let helpUser;

    User.findByMail(body.email).then((user) => {
        helpUser = user;
        return user;
    }).then((user) => {
        return user.insertChangePasswordToken();
    }).then((data) => {
        return mailTemplate.fetchMailTemplate({
            key: data.key.replace(/\//g, '%2F'),    // to replace the slashes in the key because it would mess with the URL
            firstName: helpUser.firstName,
            lastName: helpUser.lastName
        });
    }).catch((e) => {
        log.Console({
            message: "Error while reading template!",
            error: e
        });
    }).then((template) => {
        sg.setApiKey(C.SENDGRID_API_KEY);

        const msg = {
            to: helpUser.email,
            from: 'Bewegungskontrolle@zagar.spdns.org',
            subject: 'Change password',
            html: template,
        };

        sg.send(msg);
        res.send({
            status: "OK",
            message: "Mail sent successfully!"
        });

    }).catch((e) => {
        res.status(400).send({
            status: "ERROR",
            message: "This eMail is not registered to a user",
            error: e
        });
    });
});

app.get('/users/resetpasswordreq/:key', (req, res) => {
    const key = req.params.key;
    log.Console(key);

    User.findByChangePasswordToken(key).then((user) => {
        log.All(`Valid key ${key} for user ${user.email}`);
        res.send({
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            status: "OK"});
    }).catch((e) => {
        log.All(`Invalid key ${key}`);
        res.send({status: "ERROR"});
    })
});

app.post('/users/changepassword/', (req, res) => {
    const key = req.body.key.replace(/%2F/g, '\/');
    const newPassword = req.body.newPassword;

    User.findByChangePasswordToken(key).then((user) => {
        user.changePassword(newPassword).then((user) => {
            log.All(`Should have changed password in main to ${newPassword}!`);
            res.send({
                status: "OK",
                user: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        }).catch((e) => {
            log.All(e);
            log.All("Failed changing password in main!");
            res.send({
                status: "ERROR",
                message: "Failed to change password"
            });
        });
    }).catch((e) => {
        log.All("Not valid key!");
        log.All(e);
        res.send({
            changedPassword: "ERROR",
            message: "Key is not valid!"
        });
    });
});

app.get('*', (req, res) => {
   res.sendFile(path.join(publicPath, 'index.html'));
});

// Automatic redirecting to SSL
http.createServer((req, res) => {
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
    log.All(`Automatic Redirection from Port ${C.PORT} to HTTPS ${C.SSL_PORT}!`)
}).listen(C.PORT);
// HTTPS Server binding
server.listen(C.SSL_PORT, () => {
    log.All(`SSL Server started on Port ${C.SSL_PORT}!`);
});

module.exports = {app};
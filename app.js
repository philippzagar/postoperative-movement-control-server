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

app.use(bodyParser.json());

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

app.listen(3000, () => {
    log.Console("Server started!");
});

module.exports = {app};
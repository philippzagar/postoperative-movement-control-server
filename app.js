const yargs = require('yargs');
const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000, () => {
    log.Console("Server started!");
});

module.exports = {app};
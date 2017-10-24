const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const C = require('../../../constants');

const {Member} = require('../../models/Member');
const {User} = require('../../models/User');

const userOneId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'zagar@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, C.JWT_SECRET).toString()
    }]
}, {
    _id: new ObjectID(),
    email: 'jen@example.com',
    password: 'userTwoPass'
}];

const dummyMembers = [
    {
        _id: new ObjectID(),
        first_name: "Philipp",
        last_name: "Zagar",
        under_18: false,
        birth_year: 1999
    }, {
        _id: new ObjectID(),
        first_name: "Julian",
        last_name: "Zagar",
        under_18: true,
        birth_year: 2000
    }, {
        _id: new ObjectID(),
        first_name: "Petra",
        last_name: "Zagar",
        under_18: false,
    }
];

const populateMembers = (done) => {
    Member.remove({}).then(() => {
        return Member.insertMany(dummyMembers);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

module.exports = {dummyMembers, populateMembers, users, populateUsers};

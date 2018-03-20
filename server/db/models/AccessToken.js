const   mongoose = require('mongoose'),
        _ = require('lodash');

let AccessTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        require: true,
        trim: true,
        minlength: 6,
        maxlength: 6,
        unique: true
    },
    used: {
        type: Boolean,
        require: true,
        default: false
    },
    user: {
        type: String,
        require: true,
        default: ""
    }
});

AccessTokenSchema.methods.toJSON = function () {
    let AccesToken = this;
    let AccessTokenObject = AccesToken.toObject();

    return _.pick(AccessTokenObject, ['token', 'used', 'user']);
};


AccessTokenSchema.methods.devalueToken = function (user) {
    let accessToken = this;

    return new Promise((resolve, reject) => {
        accessToken.used = true;
        accessToken.user = user;
        accessToken.save().then(() => {
            log.All(`Devalued Token ${accessToken.token} to User ${accessToken.user}`);
            resolve();
        }).catch((e) => {
            log.All(`Error while devaluing token ${accessToken.token} to User ${accessToken.user}`);
            log.All(e);
            reject(e);
        })
    })
};


AccessTokenSchema.statics.findByAccessToken = function (accessToken) {
    let AccessToken = this;

    return new Promise((resolve, reject) => {
        AccessToken.findOne({changePasswordToken}).then((token) => {
            if (!token) {
                return reject();
            }

            return resolve(token);
        });
    });
};

let AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = {AccessToken};
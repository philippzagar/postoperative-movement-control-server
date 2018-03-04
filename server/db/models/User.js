const   mongoose = require('mongoose'),
        validator = require('validator'),
        jwt = require('jsonwebtoken'),
        _ = require('lodash'),
        bcrypt = require('bcryptjs'),
        C = require('../../constants');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            isAsync: true,
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    firstName: {
        type: String,
        require: true,
        minlength: 1
    },
    lastName: {
        type: String,
        require: true,
        minlength: 1
    },
    birth_day: {
        type: Number,
        require: false
    },
    birth_month: {
        type: Number,
        require: false
    },
    birth_year: {
        type: Number,
        require: false
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    changePasswordToken: {
        type: String,
        require: false,
        default: ""
    },
    firebase: {
        type: Boolean,
        require: true,
        default: false
    }
});

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'firstName', 'lastName', 'birth_day', 'birth_month', 'birth_year', 'firebase']);
};

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, C.JWT_SECRET, { expiresIn: "60m" }).toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    let user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.methods.insertChangePasswordToken = function () {
    let user = this;

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, token) => {
                user.changePasswordToken = token;
                user.save().then(() => {
                    log.All(`Inserted ${token} for user ${user.email}`);
                    resolve({
                        key: token
                    });
                }).catch((e) => {
                    log.All(e);
                    reject(e);
                });
            });
        });
    });
};

UserSchema.methods.changePassword = function(newPassword) {
    let user = this;

    return new Promise((resolve, reject) => {
        user.password = newPassword;
        user.changePasswordToken = "";
        user.save().then((user) => {
            log.All(user);
            log.All(`Should have changed the password to ${newPassword}`);
            resolve(user);
        }).catch((e) => {
            log.All("Erro while changing password!");
            log.All(e);
            reject(e);
        })
    })
};

UserSchema.statics.findByChangePasswordToken = function (changePasswordToken) {
    let User = this;

    return new Promise((resolve, reject) => {
        User.findOne({changePasswordToken}).then((user) => {
            if (!user) {
                return reject();
            }

            return resolve(user);
        });
    });
};

UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, C.JWT_SECRET);
    } catch (e) {
        if(e.name === "TokenExpiredError") {
            log.Console(`Token ${token} expired at ${e.expiredAt}`);
            return Promise.reject(new Error("TokenExpired"));
        }

        return Promise.reject(new Error("VerificationError"));
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.statics.findByMail = function (email) {
    let User = this;

    return new Promise((resolve, reject) => {
        User.findOne({email}).then((user) => {
            if (!user) {
                return reject();
            }

            return resolve(user);
        });
    });
};

UserSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = {User};
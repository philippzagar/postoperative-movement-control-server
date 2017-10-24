const   {User} = require('../db/models/User'),
        log = global.log;


let logMiddleware = (req, res, next) => {
    let token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        let content = req.method + " " + req.originalUrl + " " + "User: " + user.email;

        log.All(content);

        next();
    }).catch(() => {
        let content = req.method + " " + req.originalUrl + " " + "Invalid Token! " + token;

        log.All(content);

        next();
    });
};

module.exports = {logMiddleware};

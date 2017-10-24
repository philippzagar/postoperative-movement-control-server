let {User} = require('../db/models/User');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
          return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        if(e.toString() === "Error: TokenExpired") {
            log.All(`Token ${token} expired!`);
            return res.status(401).send({
              error: "TokenExpired",
              message: "Token expired, please Log in again!"
            })
        }

        log.All(`Token ${token} is invalid!`);

        res.status(401).send({
            error: "InvalidToken",
            message: "The Token that was passed is invalid!"});
    });
};

module.exports = {authenticate};

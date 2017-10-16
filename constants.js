// Require npm package
const fs = require('fs');

// Use HTL PC DB or RPI DB
const USING_HTL_DB = false;

// SSL Certificates
const SSL_CERT = {
    key: fs.readFileSync('./certs/privkey.pem'),
    cert: fs.readFileSync('./certs/fullchain.pem'),
    ca: fs.readFileSync('./certs/chain.pem')
};

const JWT_SECRET = "dipl2017";

let DB_USER = "",
    DB_PW = "",
    DB_AuthMechanism = "",
    DB_AuthSource = "";

let PORT = 0,
    SSL_PORT = 0;

if(USING_HTL_DB) {
    DB_USER = "MyUser";
    DB_PW = "User123";
    DB_AuthMechanism = "SCRAM-SHA-1";
    DB_AuthSource = "MyApp";
    PORT = 80;
    SSL_PORT = 443;
} else {
    DB_USER = "MyAppUser";
    DB_PW = "12345";
    DB_AuthMechanism = "SCRAM-SHA-1";
    DB_AuthSource = "MyApp";
    PORT = 80;
    SSL_PORT = 443;
}

module.exports = {
    USING_HTL_DB,
    SSL_CERT,
    DB_USER,
    DB_PW,
    DB_AuthMechanism,
    DB_AuthSource,
    PORT,
    SSL_PORT,
    JWT_SECRET
};

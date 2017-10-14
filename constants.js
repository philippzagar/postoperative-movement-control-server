//Use HTL PC DB or RPI DB
const USING_HTL_DB = false;

let DB_USER = "";
let DB_PW = "";
let DB_AuthMechanism = "";
let DB_AuthSource = "";

let PORT = 0;
let SSL_PORT = 0;

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
    DB_USER,
    DB_PW,
    DB_AuthMechanism,
    DB_AuthSource,
    PORT,
    SSL_PORT
};
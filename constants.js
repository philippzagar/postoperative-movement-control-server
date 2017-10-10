//Use HTL PC DB or RPI DB
const USING_HTL_DB = true;

let DB_USER = "";
let DB_PW = "";
let DB_AuthMechanism = "";
let DB_AuthSource = "";

if(USING_HTL_DB) {
    DB_USER = "MyUser";
    DB_PW = "User123";
    DB_AuthMechanism = "SCRAM-SHA-1";
    DB_AuthSource = "MyApp";
} else {
    DB_USER = "MyAppUser";
    DB_PW = "12345";
    DB_AuthMechanism = "SCRAM-SHA-1";
    DB_AuthSource = "MyApp";
}

module.exports = {
    USING_HTL_DB,
    DB_USER,
    DB_PW,
    DB_AuthMechanism,
    DB_AuthSource
};

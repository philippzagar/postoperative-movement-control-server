const mysql = require('mysql');

function insertQuery(query) {
    let con = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'raspberry',
        database : 'dipl'
    });

    con.connect(function(err) {
        if (err) {
            /*log.Console("Failed to connect to DB!");
            log.Console(err);
            log.File("Failed to connect to DB!");
            log.File(err);*/
            throw err;
        }
        con.query(query, function (err, result) {
            if (err) {
                /*log.Console("Failed to perform query to DB!");
                log.Console(err);
                log.File("Failed to  perform query to DB!");
                log.File(err);*/
                throw err;
            }
            /*log.Console(`Successfully performed query ${query}`);
            log.File(`Successfully performed query ${query}`);*/
            con.end();
        });
    });
}

module.exports = {
    insertQuery
};




const   fs = require('fs'),
        path = require('path');

const fetchMailTemplate = (data) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, './mailTemplate.html'), 'utf8', (err, template) => {
            if(err) {
                log.All("Error while reading html template!");
                log.All(err);
                reject(err);
            }

            resolve(template.replace('[KEY]', data.key).replace('[FIRST_NAME]', data.firstName).replace('[LAST_NAME]', data.lastName));
        });
    });
};

module.exports = {
    fetchMailTemplate
};
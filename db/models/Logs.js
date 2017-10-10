const mongoose = require('mongoose');

let Logs = mongoose.model('Logs', {
    date: {
        type: Date,
        default: Date.now
    },
    data: {
        type: String,
        required: true
    }
});

module.exports = {Logs};
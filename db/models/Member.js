const mongoose = require('mongoose');

let Member = mongoose.model('Member', {
    first_name: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    under_18: {
        type: Boolean,
        default: true
    },
    birth_year: {
        type: Number,
        minlength: 4,
        default: null
    }
});

module.exports = {Member};

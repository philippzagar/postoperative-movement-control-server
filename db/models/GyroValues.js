const mongoose = require('mongoose');
const date = require('./../../modules/date');

let GyroValues = mongoose.model('GyroValues', {
    properties: {
        description: {
            type: String,
            trim: true,
            required: false
        },
        gyroID: {
            type: Number,
            required: true,
            min: 1,
            max: 4
        },
        date: {
            type: String,
            default: date.getDateTime()
        }
    },

    values: {
        pitch: {
            type: Number,
            required: true
        },
        roll: {
            type: Number,
            required: true
        },
        yaw: {
            type: Number,
            required: true
        }
    },

    rawValues: {
        gyroX: {
            type: Number,
            required: false
        },
        gyroY: {
            type: Number,
            required: false
        },
        gyroZ: {
            type: Number,
            required: false
        },
        accX: {
            type: Number,
            required: false
        },
        accY: {
            type: Number,
            required: false
        },
        accZ: {
            type: Number,
            required: false
        }
    }
});

module.exports = {GyroValues};

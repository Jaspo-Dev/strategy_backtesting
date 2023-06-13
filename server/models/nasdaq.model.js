const mongoose = require('mongoose');

const subNasdaqSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: 'This field is required',
            index: true,
        },
        addedSecurity: {
            type: String
        },
        dateAdded: {
            type: String,
        },
        removedTicker: {
            type: String
        },
        removedSecurity: {
            type: String
        },
        date: {
            type: Date,
            required: 'This field is required',
            index: true
        },
        reason: {
            type: String
        }
    }
);

const NasdaqSchema = new mongoose.Schema(
    {
        decideDate: {
            type: Date,
            required: true
        },
        nasdaq: [ subNasdaqSchema ]
    }
);

module.exports = mongoose.model('Nasdaq', NasdaqSchema);
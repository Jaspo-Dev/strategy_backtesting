const mongoose = require("mongoose");

const HistoricalSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            index: true,
        },
        adjDividend: {
            type: Number,
            required: true
        },
        dividend: {
            type: Number,
            required: true
        },
        recordDate: {
            type: Date,
        },
        paymentDate: {
            type: Date,
        },
        declarationDate: {
            type: Date,
        }
    }
);

const DividendSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            index: true,
        },
        historical: [
            HistoricalSchema
        ]
    }
);

module.exports = mongoose.model('Dividend', DividendSchema);
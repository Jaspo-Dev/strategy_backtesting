const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            index: true
        },
        open: {
            type: Number,
            required: true
        },
        high: {
            type: Number,
            required: true
        },
        low: {
            type: Number,
            required: true
        },
        close: {
            type: Number,
            required: true
        },
        adjClose: {
            type: Number,
            required: true
        },
        volume: {
            type: String,
            required: true
        },
        unadjustedVolume: {
            type: String,
            required: true
        },
        change: {
            type: Number,
            required: true
        },
        changePercent: {
            type: Number,
            required: true
        },
        vwap: {
            type: Number,
            required: true
        },
        changeOverTime: {
            type: Number,
            required: true
        },
    }
);
const StockPriceSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            index: true
        },
        historical: [
            historySchema
        ]
    }
);

module.exports = mongoose.model('StockPrice', StockPriceSchema);
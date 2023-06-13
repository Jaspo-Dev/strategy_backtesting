const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
    {
        decideDate: {
            type: Date,
            required: true,
        },
        symbol: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        price: {
            type: Number,
            required: true,
        },
        beta: {
            type: String,
            required: true,
        },
        volAvg: {
            type: String,
            required: true,
        },
        mkCap: {
            type: String,
        },
        lastDiv: {
            type: Number,
            required: true,
        },
        range: {
            start: {
                type: Number,
            },
            end: {
                type: Number,
            }
        },
        change: {
            type: Number,
        },
        companyName: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        cik: {
            type: String,
            required: true
        },
        isin: {
            type: String,
            required: true
        },
        cusip: {
            type: String,
            required: true
        },
        exchange: {
            type: String,
            required: true
        },
        exchangeShortName: {
            type: String,
            required: true
        },
        industry: {
            type: String,
            required: true
        },
        website: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        ceo: {
            type: String,
            required: true
        },
        sector: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        fullTimeEmployees: {
            type: Number,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
        },
        zip: {
            type: String,
            required: true
        },
        dcfDiff: {
            type: String,
            required: true
        },
        dcf: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        ipoDate: {
            type: Date,
            required: true
        },
        defaultImage: {
            type: Boolean,
            default: false 
        },
        isEtf: {
            type: Boolean,
            default: false
        },
        isActivelyTrading: {
            type: Boolean,
            default: false
        },
        isAcr: {
            type: Boolean,
            default: false
        },
        isFund: {
            type: Boolean,
            default: false
        }
    }
);

module.exports = mongoose.model('Company', CompanySchema);
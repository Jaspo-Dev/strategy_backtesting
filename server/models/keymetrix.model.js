const mongoose = require("mongoose");

const SubMetrixSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            index: true,
        },
        period: {
            type: String,
        },
        revenuePerShare: {
            type: String,
        },
        netIncomePerShare: {
            type: String,
        },
        operatingCashFlowPerShare: {
            type: String,
        },
        freeCashFlowPerShare: {
            type: String,
        },
        cashPerShare: {
            type: String,
        },
        bookValuePerShare: {
            type: String,
        },
        tangibleBookValuePerShare: {
            type: String,
        },
        shareholdersEquityPerShare: {
            type: String,
        },
        interestDebtPerShare: {
            type: String,
        },
        marketCap: {
            type: String,
        },
        enterpriseValue: {
            type: String,
        },
        peRatio: {
            type: String,
        },
        priceToSalesRatio: {
            type: String,
        },
        pocfratio: {
            type: String,
        },
        pfcfRatio: {
            type: String,
        },
        pbRatio: {
            type: String,
        },
        ptbRatio: {
            type: String,
        },
        evToSales: {
            type: String,
        },
        enterpriseValueOverEBITDA: {
            type: String,
        },
        evToOperatingCashFlow: {
            type: String,
        },
        evToFreeCashFlow: {
            type: String,
        },
        earningsYield: {
            type: String,
        },
        freeCashFlowYield: {
            type: String,
        },
        debtToEquity: {
            type: String,
        },
        debtToAssets: {
            type: String,
        },
        netDebtToEBITDA: {
            type: String,
        },
        currentRatio: {
            type: String,
        },
        interestCoverage: {
            type: String,
        },
        incomeQuality: {
            type: String,
        },
        dividendYield: {
            type: String,
        },
        payoutRatio: {
            type: String,
        },
        salesGeneralAndAdministrativeToRevenue: {
            type: String,
        },
        researchAndDdevelopementToRevenue: {
            type: String,
        },
        intangiblesToTotalAssets: {
            type: String,
        },
        capexToOperatingCashFlow: {
            type: String,
        },
        capexToRevenue: {
            type: String,
        },
        capexToDepreciation: {
            type: String,
        },
        stockBasedCompensationToRevenue: {
            type: String,
        },
        grahamNumber: {
            type: String,
        },
        roic: {
            type: String,
        },
        returnOnTangibleAssets: {
            type: String,
        },
        grahamNetNet: {
            type: String,
        },
        workingCapital: {
            type: String,
        },
        tangibleAssetValue: {
            type: String,
        },
        netCurrentAssetValue: {
            type: String,
        },
        investedCapital: {
            type: Number,
        },
        averageReceivables: {
            type: String,
        },
        averagePayables: {
            type: String,
        },
        averageInventory: {
            type: String,
        },
        daysSalesOutstanding: {
            type: String,
        },
        daysPayablesOutstanding: {
            type: String,
        },
        daysOfInventoryOnHand: {
            type: String,
        },
        receivablesTurnover: {
            type: String,
        },
        payablesTurnover: {
            type: String,
        },
        inventoryTurnover: {
            type: String,
        },
        roe: {
            type: String,
        },
        capexPerShare: {
            type: String,
        }
    }
);

const KeyMetrixSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            index: true,
        },
        historical: [
            SubMetrixSchema
        ]
    }
);

module.exports = mongoose.model('KeyMetrics', KeyMetrixSchema);
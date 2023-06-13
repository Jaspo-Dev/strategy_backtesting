const axios = require('axios');
const Nasdaq = require('../models/nasdaq.model');
const StockPrice = require('../models/stockprice.model');
const KeyMetrics = require('../models/keymetrix.model');
const Dividend = require('../models/dividend.model');
const Company = require('../models/company.model');
const { response } = require('express');

const getUrl = (url) => {
    return process.env.FINANCIAL_URL + url;
}

const createCompany = async (symbol) => {
    if ( !Company.findOne({  symbol: symbol })) {
        axios.get(getUrl('profile/' + symbol + '?apikey=' + process.env.API_KEY))
        .then(comp => {
            let newCompany = new Company({
                symbol: comp.symbol,
                price: comp.price,
                beta: comp.beta,
                volAvg: comp.volAvg,
                mktCap: comp.mktCap,
                lastDiv: comp.lastDiv,
                range: {
                    start: comp.range.split('-')[0],
                    start: comp.range.split('-')[1],
                },
                changes: comp.changes,
                companyName: comp.companyName,
                currency: comp.currency,
                cik: comp.cik,
                isin: comp.isin,
                cusip: comp.cusip,
                exchange: comp.exchange,
                exchangeShortName: comp.exchangeShortName,
                industry: comp.industry,
                website: comp.website,
                description: comp.description,
                ceo: comp.ceo,
                sector: comp.sector,
                country: comp.country,
                fullTimeEmployees: comp.fullTimeEmployees,
                phone: comp.phone,
                address: comp.address,
                city: comp.city,
                state: comp.state,
                zip: comp.zip,
                dcfDiff: comp.dcfDiff,
                dcf: comp.dcf,
                image: comp.image,
                ipoDate: Date(comp.ipoDate),
                defaultImage: comp.defaultImage == 'true' ? 1 : 0,
                isEtf: comp.isEtf == 'true' ? 1 : 0,
                isActivelyTrading: comp.isActivelyTrading == 'true' ? 1 : 0,
                isAdr: comp.isAdr == 'true' ? 1 : 0,
                isFund: comp.isFund == 'true' ? 1 : 0
            });
    
            newCompany.save((err, company) => {
                if( err ) return false;
                else return company;
            });
        });
    }

    return await Company.findOne( { symbol: symbol } );
};

// exports.companies = (req, res) => {
//     axios.get(getUrl('profile/stock/list?apikey=' + process.env.API_KEY))
//         .then((response) => {
//             storeData.symbolsList.forEach(temp => {
//                 if(!Company.findOne({symbol: temp.symbol}))
//                 {
//                     let newCompany = new Company({
//                         symbol: comp.symbol,
//                         price: comp.price,
//                         beta: comp.beta,
//                         volAvg: comp.volAvg,
//                         mktCap: comp.mktCap,
//                         lastDiv: comp.lastDiv,
//                         range: {
//                             start: comp.range.split('-')[0],
//                             start: comp.range.split('-')[1],
//                         },
//                         changes: comp.changes,
//                         companyName: comp.companyName,
//                         currency: comp.currency,
//                         cik: comp.cik,
//                         isin: comp.isin,
//                         cusip: comp.cusip,
//                         exchange: comp.exchange,
//                         exchangeShortName: comp.exchangeShortName,
//                         industry: comp.industry,
//                         website: comp.website,
//                         description: comp.description,
//                         ceo: comp.ceo,
//                         sector: comp.sector,
//                         country: comp.country,
//                         fullTimeEmployees: comp.fullTimeEmployees,
//                         phone: comp.phone,
//                         address: comp.address,
//                         city: comp.city,
//                         state: comp.state,
//                         zip: comp.zip,
//                         dcfDiff: comp.dcfDiff,
//                         dcf: comp.dcf,
//                         image: comp.image,
//                         ipoDate: Date(comp.ipoDate),
//                         defaultImage: comp.defaultImage == 'true' ? 1 : 0,
//                         isEtf: comp.isEtf == 'true' ? 1 : 0,
//                         isActivelyTrading: comp.isActivelyTrading == 'true' ? 1 : 0,
//                         isAdr: comp.isAdr == 'true' ? 1 : 0,
//                         isFund: comp.isFund == 'true' ? 1 : 0
//                     });
//                     // let newCompany = new Company({
//                     //     symbol: temp.symbol,
//                     //     name: temp.name,
//                     //     price: temp.price,
//                     //     exchange: temp.exchange == 'NASDAQ' ? 1 : 0,
//                     // });
    
//                     newCompany.save();
//                 }
//             });

//             res.send(200);
//         });
// }

exports.nasdaq = async (req, res) => {
    axios.get(getUrl('historical/nasdaq_constituent?apikey=' + process.env.API_KEY))
    .then(response => {
        let subs = [];
        storeData.forEach(nas => {
            subs.push({
                symbol: nas.symbol,
                addedSecurity: nas.addedSecurity,
                dateAdded: nas.dateAdded,
                removedTicker: nas.removedTicker,
                removedSecurity: nas.removedSecurity,
                date: nas.date,
                reason: nas.reason
            });
        });

        let newNasdaq = new Nasdaq({
            decideDate: Date.now(),
            nasdaq: subs
        });

        newNasdaq.save();

        res.send(200);
    });
};

exports.stockprice = (req, res) => {
    Nasdaq.findOne({}, {}, { sort: { _id: -1 } })
        .then(nasdaq => {
            let i = 0;
            nasdaq.nasdaq.forEach((nas) => {
                StockPrice.findOne({symbol: nas.symbol})
                .then(tmp => {
                    let subs = [];

                    if (i < 5) {
                        if (tmp == null) {
                            axios.get(getUrl('historical-price-full/' + nas.symbol + '?apikey=' + process.env.API_KEY))
                            .then(response => {
                                response.data.historical.forEach(history => {
                                    let storeData = history;

                                    subs.push({
                                        date: Date(storeData.date),
                                        open: storeData.open,
                                        high: storeData.high,
                                        low: storeData.low,
                                        close: storeData.close,
                                        adjClose: storeData.adjClose,
                                        volume: storeData.volume,
                                        unadjustedVolume: storeData.unadjustedVolume,
                                        change: storeData.change,
                                        changePercent: storeData.changePercent,
                                        vwap: storeData.vwap,
                                        changeOverTime: storeData.changeOverTime
                                    });
                                });

                                let newPrice = new StockPrice({
                                    symbol: nas.symbol,
                                    historical: subs
                                });
                                newPrice.save();

                                sub = [];
                            });

                            i++;
                        }

                        else {
                            axios.get(getUrl('historical-price-full/' + nas.symbol + '?apikey=' + process.env.API_KEY))
                            .then(response => {
                                response.data.historical.forEach(history => {
                                    if(!tmp.historical.find(obj => Date(obj.date) == Date(history.date))) {
                                        let storeData = history;

                                        subs.push({
                                            date: Date(storeData.date),
                                            open: storeData.open,
                                            high: storeData.high,
                                            low: storeData.low,
                                            close: storeData.close,
                                            adjClose: storeData.adjClose,
                                            volume: storeData.volume,
                                            unadjustedVolume: storeData.unadjustedVolume,
                                            change: storeData.change,
                                            changePercent: storeData.changePercent,
                                            vwap: storeData.vwap,
                                            changeOverTime: storeData.changeOverTime
                                        });
                                    }
                                });

                                let newPrice = new StockPrice({
                                    symbol: nas.symbol,
                                    historical: subs
                                });
                                newPrice.save();

                                sub = [];
                            });
                        }
                    }
                });
            
            });

            res.send(200);
        });
};

exports.companies = (req, res) => {
    Nasdaq.findOne({}, {}, {  sort: { decideDate: -1 }})
    .then(nasdaq => {
        let i = 0;
        nasdaq.nasdaq.forEach(nas => {
            Company.findOne({ symbol: nas.symbol, decideDate: nasdaq.decideDate })
            .then(tmp => {
                if(i < 5) {
                    if (tmp == null) {
                        axios.get(getUrl('profile/' + nas.symbol + '?apikey=' + process.env.API_KEY))
                        .then(response => {
                            let storeData = response.data[0];
                            let newCompany = new Company({
                                decideDate: nasdaq.decideDate,
                                symbol: storeData.symbol,
                                price: storeData.price,
                                beta: storeData.beta,
                                volAvg: storeData.volAvg,
                                mktCap: storeData.mktCap,
                                lastDiv: storeData.lastDiv,
                                range: {
                                    start: storeData.range ? storeData.range.split('-')[0] : 0,
                                    start: storeData.range ? storeData.range.split('-')[1] : 0,
                                },
                                changes: storeData.changes,
                                companyName: storeData.companyName,
                                currency: storeData.currency,
                                cik: storeData.cik,
                                isin: storeData.isin,
                                cusip: storeData.cusip,
                                exchange: storeData.exchange,
                                exchangeShortName: storeData.exchangeShortName,
                                industry: storeData.industry,
                                website: storeData.website,
                                description: storeData.description,
                                ceo: storeData.ceo,
                                sector: storeData.sector,
                                country: storeData.country,
                                fullTimeEmployees: storeData.fullTimeEmployees,
                                phone: storeData.phone,
                                address: storeData.address,
                                city: storeData.city,
                                state: storeData.state,
                                zip: storeData.zip,
                                dcfDiff: storeData.dcfDiff,
                                dcf: storeData.dcf,
                                image: storeData.image,
                                ipoDate: Date(storeData.ipoDate),
                                defaultImage: storeData.defaultImage == 'true' ? 1 : 0,
                                isEtf: storeData.isEtf == 'true' ? 1 : 0,
                                isActivelyTrading: storeData.isActivelyTrading == 'true' ? 1 : 0,
                                isAdr: storeData.isAdr == 'true' ? 1 : 0,
                                isFund: storeData.isFund == 'true' ? 1 : 0
                            });

                            newCompany.save();
                            
                        })
                        i++;
                    }
                }

            })
        });
    });
    res.send(200);
}

exports.keymetrix = (req, res) => {
    Nasdaq.findOne({}, {}, { sort: { _id: -1 } })
        .then((nasdaq) => {
            let subs = [];
            let i = 0;
            nasdaq.nasdaq.forEach((nas) => {
                KeyMetrics.findOne({symbol: nas.symbol})
                .then(tmp => {
                    if (i < 5) {
                        if (tmp == null) {
                            axios.get(getUrl('key-metrics/' + nas.symbol + '?apikey=' + process.env.API_KEY))
                            .then(response => {
                                response.data.forEach(history => {
                                    let storeData = history;

                                    subs.push({
                                        date: storeData.date,
                                        period: storeData.period,
                                        revenuePerShare: storeData.revenuePerShare,
                                        netIncomePerShare: storeData.netIncomePerShare,
                                        operatingCashFlowPerShare: storeData.operatingCashFlowPerShare,
                                        freeCashFlowPerShare: storeData.freeCashFlowPerShare,
                                        cashPerShare: storeData.cashPerShare,
                                        bookValuePerShare: storeData.bookValuePerShare,
                                        tangibleBookValuePerShare: storeData.tangibleBookValuePerShare,
                                        shareholdersEquityPerShare: storeData.shareholdersEquityPerShare,
                                        interestDebtPerShare: storeData.interestDebtPerShare,
                                        marketCap: storeData.marketCap,
                                        enterpriseValue: storeData.enterpriseValue,
                                        peRatio: storeData.peRatio,
                                        priceToSalesRatio: storeData.priceToSalesRatio,
                                        pocfratio: storeData.pocfratio,
                                        pfcfRatio: storeData.pfcfRatio,
                                        pbRatio: storeData.pbRatio,
                                        ptbRatio: storeData.ptbRatio,
                                        evToSales: storeData.evToSales,
                                        enterpriseValueOverEBITDA: storeData.enterpriseValueOverEBITDA,
                                        evToOperatingCashFlow: storeData.evToOperatingCashFlow,
                                        evToFreeCashFlow: storeData.evToFreeCashFlow,
                                        earningsYield: storeData.earningsYield,
                                        freeCashFlowYield: storeData.freeCashFlowYield,
                                        debtToEquity: storeData.debtToEquity,
                                        debtToAssets: storeData.debtToAssets,
                                        netDebtToEBITDA: storeData.netDebtToEBITDA,
                                        currentRatio: storeData.currentRatio,
                                        interestCoverage: storeData.interestCoverage,
                                        incomeQuality: storeData.incomeQuality,
                                        dividendYield: storeData.dividendYield,
                                        payoutRatio: storeData.payoutRatio,
                                        salesGeneralAndAdministrativeToRevenue: storeData.salesGeneralAndAdministrativeToRevenue,
                                        researchAndDdevelopementToRevenue: storeData.researchAndDdevelopementToRevenue,
                                        intangiblesToTotalAssets: storeData.intangiblesToTotalAssets,
                                        capexToOperatingCashFlow: storeData.capexToOperatingCashFlow,
                                        capexToRevenue: storeData.capexToRevenue,
                                        capexToDepreciation: storeData.capexToDepreciation,
                                        stockBasedCompensationToRevenue: storeData.stockBasedCompensationToRevenue,
                                        grahamNumber: storeData.grahamNumber,
                                        roic: storeData.roic,
                                        returnOnTangibleAssets: storeData.returnOnTangibleAssets,
                                        grahamNetNet: storeData.grahamNetNet,
                                        workingCapital: storeData.workingCapital,
                                        tangibleAssetValue: storeData.tangibleAssetValue,
                                        netCurrentAssetValue: storeData.netCurrentAssetValue,
                                        investedCapital: storeData.investedCapital,
                                        averageReceivables: storeData.averageReceivables,
                                        averagePayables: storeData.averagePayables,
                                        averageInventory: storeData.averageInventory,
                                        daysSalesOutstanding: storeData.daysSalesOutstanding,
                                        daysPayablesOutstanding: storeData.daysPayablesOutstanding,
                                        daysOfInventoryOnHand: storeData.daysOfInventoryOnHand,
                                        receivablesTurnover: storeData.receivablesTurnover,
                                        payablesTurnover: storeData.payablesTurnover,
                                        inventoryTurnover: storeData.inventoryTurnover,
                                        roe: storeData.roe,
                                        capexPerShare: storeData.capexPerShare
                                    });
                                });

                                let newKeyMetric = new KeyMetrics({
                                    symbol: nas.symbol,
                                    historical: subs
                                });

                                newKeyMetric.save();

                                sub = [];
                            });

                            i++;
                        } else {
                            axios.get(getUrl('key-metrics/' + nas.symbol + '?apikey=' + process.env.API_KEY))
                            .then(response => {
                                let cnt = 0;
                                
                                response.data.forEach(history => {
                                    let storeData = history;
                                    if(tmp.historical.find(obj => new Date(obj.date).getTime() == new Date(history.date).getTime()) == undefined) {
                                        cnt++;
                                    }

                                    subs.push({
                                        date: storeData.date,
                                        period: storeData.period,
                                        revenuePerShare: storeData.revenuePerShare,
                                        netIncomePerShare: storeData.netIncomePerShare,
                                        operatingCashFlowPerShare: storeData.operatingCashFlowPerShare,
                                        freeCashFlowPerShare: storeData.freeCashFlowPerShare,
                                        cashPerShare: storeData.cashPerShare,
                                        bookValuePerShare: storeData.bookValuePerShare,
                                        tangibleBookValuePerShare: storeData.tangibleBookValuePerShare,
                                        shareholdersEquityPerShare: storeData.shareholdersEquityPerShare,
                                        interestDebtPerShare: storeData.interestDebtPerShare,
                                        marketCap: storeData.marketCap,
                                        enterpriseValue: storeData.enterpriseValue,
                                        peRatio: storeData.peRatio,
                                        priceToSalesRatio: storeData.priceToSalesRatio,
                                        pocfratio: storeData.pocfratio,
                                        pfcfRatio: storeData.pfcfRatio,
                                        pbRatio: storeData.pbRatio,
                                        ptbRatio: storeData.ptbRatio,
                                        evToSales: storeData.evToSales,
                                        enterpriseValueOverEBITDA: storeData.enterpriseValueOverEBITDA,
                                        evToOperatingCashFlow: storeData.evToOperatingCashFlow,
                                        evToFreeCashFlow: storeData.evToFreeCashFlow,
                                        earningsYield: storeData.earningsYield,
                                        freeCashFlowYield: storeData.freeCashFlowYield,
                                        debtToEquity: storeData.debtToEquity,
                                        debtToAssets: storeData.debtToAssets,
                                        netDebtToEBITDA: storeData.netDebtToEBITDA,
                                        currentRatio: storeData.currentRatio,
                                        interestCoverage: storeData.interestCoverage,
                                        incomeQuality: storeData.incomeQuality,
                                        dividendYield: storeData.dividendYield,
                                        payoutRatio: storeData.payoutRatio,
                                        salesGeneralAndAdministrativeToRevenue: storeData.salesGeneralAndAdministrativeToRevenue,
                                        researchAndDdevelopementToRevenue: storeData.researchAndDdevelopementToRevenue,
                                        intangiblesToTotalAssets: storeData.intangiblesToTotalAssets,
                                        capexToOperatingCashFlow: storeData.capexToOperatingCashFlow,
                                        capexToRevenue: storeData.capexToRevenue,
                                        capexToDepreciation: storeData.capexToDepreciation,
                                        stockBasedCompensationToRevenue: storeData.stockBasedCompensationToRevenue,
                                        grahamNumber: storeData.grahamNumber,
                                        roic: storeData.roic,
                                        returnOnTangibleAssets: storeData.returnOnTangibleAssets,
                                        grahamNetNet: storeData.grahamNetNet,
                                        workingCapital: storeData.workingCapital,
                                        tangibleAssetValue: storeData.tangibleAssetValue,
                                        netCurrentAssetValue: storeData.netCurrentAssetValue,
                                        investedCapital: storeData.investedCapital,
                                        averageReceivables: storeData.averageReceivables,
                                        averagePayables: storeData.averagePayables,
                                        averageInventory: storeData.averageInventory,
                                        daysSalesOutstanding: storeData.daysSalesOutstanding,
                                        daysPayablesOutstanding: storeData.daysPayablesOutstanding,
                                        daysOfInventoryOnHand: storeData.daysOfInventoryOnHand,
                                        receivablesTurnover: storeData.receivablesTurnover,
                                        payablesTurnover: storeData.payablesTurnover,
                                        inventoryTurnover: storeData.inventoryTurnover,
                                        roe: storeData.roe,
                                        capexPerShare: storeData.capexPerShare
                                    });
                                });
                                if(cnt > 0) {
                                    KeyMetrics.findOneAndUpdate(
                                        {
                                            symbol: nas.symbol
                                        },
                                        {
                                            historical: subs
                                        }
                                    );
                                }

                                sub = [];
                            });

                            i++;
                        }
                    }
                });
            
            });
        });

    res.send(200);
};

exports.dividend = (req, res) => {
    Nasdaq.findOne({}, {}, { sort: { _id: -1 } })
        .then((nasdaq) => {
            let subs = [];
            let i = 0;
            nasdaq.nasdaq.forEach((nas) => {
                Dividend.findOne({symbol: nas.symbol})
                .then(tmp => {
                    if (i < 500) {
                        if (tmp == null) {
                            axios.get(getUrl('historical-price-full/stock_dividend/' + nas.symbol + '?apikey=' + process.env.API_KEY))
                            .then(response => {
                                response.data.historical.forEach(history => {
                                    let storeData = history;

                                    subs.push({
                                        date: Date(history.date),
                                        adjDividend: storeData.adjDividend,
                                        dividend: storeData.dividend,
                                        recordDate: storeData.recordDate,
                                        paymentDate: storeData.paymentDate,
                                        declarationDate: storeData.declarationDate
                                    });
                                });

                                let newDividend = new Dividend({
                                    symbol: nas.symbol,
                                    historical: subs
                                });

                                newDividend.save();

                                sub = [];
                            });

                            i++;
                        } else {
                            axios.get(getUrl('historical-price-full/stock_dividend/' + nas.symbol + '?apikey=' + process.env.API_KEY))
                            .then(response => {
                                let cnt = 0;
                                
                                response.data.forEach(history => {
                                    let storeData = history;
                                    if(tmp.historical.find(obj => new Date(obj.date).getTime() == new Date(history.date).getTime()) == undefined) {
                                        cnt++;
                                    }

                                    subs.push({
                                        date: Date(history.date),
                                        adjDividend: storeData.adjDividend,
                                        dividend: storeData.dividend,
                                        recordDate: storeData.recordDate,
                                        paymentDate: storeData.paymentDate,
                                        declarationDate: storeData.declarationDate
                                    });
                                });
                                if(cnt > 0) {
                                    Dividend.findOneAndUpdate(
                                        {
                                            symbol: nas.symbol
                                        },
                                        {
                                            historical: subs
                                        }
                                    );
                                }

                                sub = [];
                            });

                            i++;
                        }
                    }
                });
            
            });
        });

    res.send(200);
};
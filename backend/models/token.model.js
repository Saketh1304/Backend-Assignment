const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    chainId: String,
    dexId: String,
    url: String,
    pairAddress: String,
    baseToken: {
        address: String,
        name: String,
        symbol: String
    },
    quoteToken: {
        address: String,
        name: String,
        symbol: String
    },
    priceNative: String,
    priceUsd: String,
    txns: {
        m5: { buys: Number, sells: Number },
        h1: { buys: Number, sells: Number },
        h6: { buys: Number, sells: Number },
        h24: { buys: Number, sells: Number },
    },
    volume: {
        h24: Number,
        h6: Number,
        h1: Number,
        m5: Number,
    },
    priceChange: {
        m5: Number,
        h1: Number,
        h6: Number,
        h24: Number,
    },
    liquidity: {
        usd: Number,
        base: Number,
        quote: Number,
    },
    pairCreatedAt: Number,
    info: {
        imageUrl: String,
        websites: [{ label: String, url: String }],
        socials: [{
            type: {type:String}, 
            url:{type:String}  
        }],
    }
});

const TokenPair = mongoose.model('TokenPair', tokenSchema);
module.exports = TokenPair;

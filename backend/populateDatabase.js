const mongoose = require('mongoose');
const axios = require('axios'); 
const TokenPair = require('./models/token.model');
require('dotenv').config();

mongoose.connect(process.env.MONGO);

async function populateDatabase() {
    try {
        const response = await axios.get("https://api.dexscreener.com/latest/dex/tokens/inj19dtllzcquads0hu3ykda9m58llupksqwekkfnw");
        const dataset = response.data;

        if (dataset.pairs && Array.isArray(dataset.pairs)) {
            for (const pair of dataset.pairs) {
              
                const existingPair = await TokenPair.findOne({ pairAddress: pair.pairAddress });

               
                if (!existingPair) {
                    const tokenPair = new TokenPair(pair);
                    await tokenPair.save();
                    console.log(`Inserted new token pair with address: ${pair.pairAddress}`);
                } else {
                    console.log(`Token pair with address: ${pair.pairAddress} already exists.`);
                }
            }
            console.log('Finished checking the dataset.');
        } else {
            console.error('Expected data structure is not found in the response');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


populateDatabase().then(() => console.log('Finished populating database.'));

module.exports = populateDatabase;
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


const userRouter = require('./routes/user.route.js');
const authRouter = require('./routes/auth.route.js');


const TokenPair = require('./models/token.model.js');
const populateDatabase = require('./populateDatabase.js');
require('dotenv').config();

console.log(process.env.MONGO)


const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
console.log(process.env.MONGO)

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        populateDatabase().then(() => console.log('Database populated with initial dataset.'));
    })
    .catch(err => console.log(err));

app.use("/api/user", userRouter);
app.use('/api/auth', authRouter);


app.get('/api/tokenPairs', async (req, res) => {
    try {
        const tokenPairs = await TokenPair.find();
        res.json(tokenPairs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/api/tokenPairs/:pairAddress/price', async (req, res) => {
    try {
        const { pairAddress } = req.params;
        const tokenPair = await TokenPair.findOne({ pairAddress: pairAddress }, 'priceNative priceUsd');
        if (!tokenPair) {
            return res.status(404).json({ message: 'Token pair not found' });
        }
        res.json({ priceNative: tokenPair.priceNative, priceUsd: tokenPair.priceUsd });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/tokenPairs/:pairAddress/volume', async (req, res) => {
    try {
        const { pairAddress } = req.params;
        const tokenPair = await TokenPair.findOne({ pairAddress: pairAddress }, 'volume');
        if (!tokenPair) {
            return res.status(404).json({ message: 'Token pair not found' });
        }
        res.json(tokenPair.volume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/api/tokenPairs', async (req, res) => {
    try {
        const tokenPair = new TokenPair(req.body);
        const newTokenPair = await tokenPair.save();
        res.status(201).json(newTokenPair);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.put('/api/tokenPairs/:pairAddress', async (req, res) => {
    console.log('Updating:', req.params.pairAddress); 
    try {
      const updatedDoc = await TokenPair.findOneAndUpdate(
        { pairAddress: req.params.pairAddress.trim() }, 
        req.body, 
        { new: true } 
      );
  
      console.log('Update result:', updatedDoc); 
  
      if (!updatedDoc) {
        return res.status(404).send({ message: 'Token pair not found' });
      }
  
      res.send(updatedDoc);
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).send({ message: 'Error updating token pair' });
    }
  });
  

  app.delete('/api/tokenPairs/:pairAddress', async (req, res) => {
    console.log('Deleting:', req.params.pairAddress); 
    try {
        const { pairAddress } = req.params;
        const deletedDoc = await TokenPair.findOneAndDelete({ pairAddress: pairAddress.trim() }); 

        console.log('Delete result:', deletedDoc); 

        if (!deletedDoc) {
            return res.status(404).json({ message: 'Token pair not found' });
        }

        res.json({ message: 'Token pair deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error); 
    }
});




app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

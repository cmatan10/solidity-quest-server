const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const signRoute = require('./routes/signRoute');
const hintRoute = require('./routes/hintRoute');
const solutionRoute = require('./routes/solutionRoute');
const compileRoute = require('./routes/compileRoute');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/sign', signRoute);
app.use('/hint', hintRoute);
app.use('/solution', solutionRoute);
app.use('/compile', compileRoute);

app.get('/', (req, res) => {
  res.send('Solidity Quest');
});

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err);
  });

module.exports = app;


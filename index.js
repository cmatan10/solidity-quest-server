const express = require('express');
const cors = require('cors');
const signRoute = require('./routes/signRoute');
const hintRoute = require('./routes/hintRoute');
const solutionRoute = require('./routes/solutionRoute');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/sign', signRoute);
app.use('/hint', hintRoute);
app.use('/solution', solutionRoute);

app.get('/', (req, res) => {
  res.send('Solidity Quest');
});

module.exports = app;





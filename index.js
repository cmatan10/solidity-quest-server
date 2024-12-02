const express = require('express');
const cors = require('cors');
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

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

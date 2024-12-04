const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  solutionId: {
    type: Number,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Solution', solutionSchema);

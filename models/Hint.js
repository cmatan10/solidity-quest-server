const mongoose = require('mongoose');

const hintSchema = new mongoose.Schema(
  {
    hintId: {
      type: Number,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    hintLinks: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Hint', hintSchema);

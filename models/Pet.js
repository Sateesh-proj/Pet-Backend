const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model('Pet', petSchema);

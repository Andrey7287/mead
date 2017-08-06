const mongoose = require('mongoose');

const attractionShema = mongoose.Schema({
  name: String,
  description: String,
  location: {lat: Number, lng: Number},
  history: {
    event: String,
    notes: String,
    email: String,
    date: Date
  },
  updateId: String,
  approved: Boolean
});

const Attraction = mongoose.model('Attraction', attractionShema);

module.exports = Attraction;
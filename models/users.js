const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  authId: String,
  name: String,
  email: String,
  role: String,
  created: Date,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
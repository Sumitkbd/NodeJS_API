const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  snum: Number,
  name: String,
  id: Number,
  phone: String,
  email: String,
  age: Number,
  address: String
});
const User = mongoose.model('User', UserSchema);
module.exports = User;

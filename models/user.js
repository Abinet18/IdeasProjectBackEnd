const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const crypto = require('crypto'); // A native JS bcrypt library for NodeJS

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }
  });
  userSchema.methods.comparePassword = function(password) {
    return password==this.password; // Return comparison of login password to password in database (true or false)
  };

module.exports = mongoose.model('User', userSchema);
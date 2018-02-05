const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const crypto = require('crypto'); // A native JS bcrypt library for NodeJS

const ideaSchema = new Schema({
    title: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, required: true, lowercase: false },
    idea: { type: String, required: true }
  });


module.exports = mongoose.model('Idea', ideaSchema);
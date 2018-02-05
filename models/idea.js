const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const crypto = require('crypto'); // A native JS bcrypt library for NodeJS

const Thought = new Schema({
  owner:String,
  text:String,
  dateofth:Date
})
const Rating = new Schema({
  rater:String,
  rate:{ type:Number,min:0,max:5}
})
const ideaSchema = new Schema({
    title: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, required: true, lowercase: false },
    idea: { type: String, required: true },
    owner: {type:String,required:true},
    dateApproved:{ type:Date},
    dateCreated:{ type:Date,required:true },    
    thoughts:{type:[Thought]},
    ratings:{type:[Rating]}
  });


module.exports = mongoose.model('Idea', ideaSchema);
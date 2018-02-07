const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const crypto = require('crypto'); // A native script for encryption
//Thought or comment schema
const Thought = new Schema({
  owner:String,
  text:String,
  dateofth:Date
})

//Rating schema
const Rating = new Schema({
  rater:String,
  rating:{ type:Number,min:0,max:5},
  dateofr:{type:Date}
})

//Idea schema
const ideaSchema = new Schema({
    title: { type: String, required: true, unique: true, lowercase: false },
    type: { type: String, required: true, lowercase: false },
    idea: { type: String, required: true },
    owner: {type:String,required:true},
    dateApproved:{ type:Date},
    dateCreated:{ type:Date,required:true },    
    thoughts:{type:[Thought]},//refers to the thought schema above
    ratings:{type:[Rating]},//refers to the rating schema above
    total:{type:Number},
    rateCount:{type:Number},
    commentCount:{type:Number}
  });


module.exports = mongoose.model('Idea', ideaSchema);

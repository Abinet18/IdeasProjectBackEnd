var express=require('express');
var logger=require('morgan');
var cors=require('cors');
var expressValidator=require('express-validator');
var mongoose=require('mongoose');
const User=require('./models/user');

mongoose.connect('mongodb://localhost/ideadb',(err)=>{
    if(err) console.log("Could not connect to database");
    else console.log("connected to the db");
});

var userRoutes=require('./routes/userRoutes');

var app=express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({origin:'http://localhost:4200'}));
app.use(expressValidator());

app.use('/users',userRoutes);


app.listen(8000);
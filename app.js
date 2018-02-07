var express=require('express');
var logger=require('morgan');
var cors=require('cors');
var expressValidator=require('express-validator');
var mongoose=require('mongoose');
const User=require('./models/user');
const Idea=require('./models/idea');
const jwt = require('jsonwebtoken'); 

var port = process.env.PORT || 8080;

mongoose.connect('mongodb://dbadmin:dbpass@ds125068.mlab.com:25068/ideadb',(err)=>{
    if(err) console.log("Could not connect to database");
    else console.log("connected to the db");
});

var userRoutes=require('./routes/userRoutes');
var ideaRoutes=require('./routes/ideaRoutes');

var app=express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({origin:'*',
              optionsSuccessStatus: 200}));
app.use(expressValidator());

app.get('/',(req,res)=>
{
    res.send("hello");
});

app.use('/users',userRoutes);

app.use('/idea',ideaRoutes);


app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
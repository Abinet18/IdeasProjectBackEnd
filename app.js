var express=require('express');
var logger=require('morgan');
var cors=require('cors');
var expressValidator=require('express-validator');
var mongoose=require('mongoose');
const User=require('./models/user');
mongoose.connect('mongodb://localhost/ideadb',(err)=>{
    if(err) console.log("Couldnot connect to database");
    else console.log("connected");
});

var app=express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(expressValidator());

app.get('/',(req,res)=>{
    
    const test=new User({email:"abinet.tafa@gmail.com",username:"abint",password:"pass"});
    test.save((err)=>{console.log(err);});
    res.send("Hello");
})
app.get('/user',(req,res)=>{
    
    User.findOne({}).then((data)=>{res.json(data)});
    
})
app.post('/user',(req,res)=>
{
    //validate before insert
    const user=new User({email:req.body.email,username:req.body.username,password:req.body.password});
    user.save().then(res.json({"success":true}));
})


app.listen(8000);
const User = require('../models/user'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const router=require('express').Router();

router.get('/',(req,res)=>{
    
    User.findOne({}).then((data)=>{res.json(data)});
    
})

router.post('/',(req,res)=>
{
    //validate before insert
    const user=new User({email:req.body.email,username:req.body.username,password:req.body.password});
    user.save().then(res.json({"success":true})).catch(err=>{console.log(err.message);});
})

module.exports=router;

const Idea = require('../models/idea'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const router=require('express').Router();

router.get('/',(req,res)=>{
    
    Idea.find({}).then((data)=>{res.json(data)});
    
})

router.post('/',(req,res)=>
{
    //validate before insert
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var title1 = req.query.title;
    var type1 = req.query.type;
    var idea1 = req.query.idea;

    const idea=new Idea({title:title1, type:type1, idea:idea1});
    idea.save((err)=>{
        if(err) 
        {
            console.log(err.message);
            res.json({success:false});
        }
        else
        {
            res.json({success:true});
        }})
        
        //console.log(title1);
})

module.exports=router;

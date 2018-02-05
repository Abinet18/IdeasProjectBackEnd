const Idea = require('../models/idea'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const router=require('express').Router();

router.get('/',(req,res)=>{
    
    Idea.find({}).then((data)=>{res.json(data)});
    
})
router.get('/approved',(req,res)=>{
    
    Idea.find({'dateApproved':{$exists:true}}).then((data)=>{res.json(data)});
    
})
router.get('/needapproval',(req,res)=>{
    
    Idea.find({'dateApproved':{$exists:false}}).then((data)=>{res.json(data)});    
})

router.post('/',(req,res)=>
{
    //validate before insert
    // var url = require('url');
    // var url_parts = url.parse(req.url, true);
    // var query = url_parts.query;

    var title1= req.body.title;
    var type1 = req.body.type;
    var idea1 = req.body.idea;
    var owner1=req.body.owner;
    var dateCreated=new Date();

    const idea=new Idea({title:title1, type:type1, idea:idea1,owner:owner1,dateCreated:dateCreated});
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
router.put('/approve/:ideaId',(req,res)=>
{
    Idea.findByIdAndUpdate({'_id':req.params.ideaId},{$set:{dateApproved:new Date()}}).then((data)=>{res.json(data)});
})
router.delete('/delete/:ideaId',(req,res)=>
{
    Idea.findOneAndRemove({'_id':req.params.ideaId}).then((data)=>{res.json(data)});
})

module.exports=router;

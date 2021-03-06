const Idea = require('../models/idea'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const router=require('express').Router();
const User = require('../models/user'); 

//@Abinet
//get Idea by Id
router.get('/getIdea/:ideaId',(req,res)=>{
    
   Idea.findOne({"_id":req.params.ideaId}).then((data)=>{
        console.log(data);
        res.json(data);
     });
        
});
//get Approved Ideas
router.get('/approved',(req,res)=>{
    
   Idea.find({'dateApproved':{$exists:true}}).sort("dateCreated").then((data)=>{res.json(data)});
       
});
//get highly rated ideas
router.get('/popular',(req,res)=>{

    Idea.find({'total':{$gt:0}}).sort({"total/rateCount":-1}).then((data)=>{res.json(data)});
   
});
//get most discussed(commented) ideas
router.get('/mostdiscussed',(req,res)=>{

    Idea.find({'commentCount':{$gt:0}}).sort({"commentCount":-1}).then((data)=>{res.json(data)});
});
//search for ideas
router.get('/searchideas/:type/:title/:owner',(req,res)=>{
    
    //construct the query, ignore a condition if the passed parameter is 0
    let query={};
    if(req.params.type!='0')
    {
        query.type=req.params.type;
    }
    if(req.params.title!='0')
    {
        query.title={$regex:req.params.title,$options:'i'};
    }
    if(req.params.owner!='0')
    {
        query.owner={$regex:req.params.owner,$options:'i'};
    }
    query.dateApproved={$exists:true};
    console.log(query);
    //Idea.find({'type':req.params.type,'title':{$regex:req.params.title,$options:'i'}}).sort({"total":-1}).then((data)=>{res.json(data)});
    Idea.find(query).sort({"total":-1}).then((data)=>{res.json(data)});
});
    


//Middleware to check for token available to protect sensitive routes

router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    console.log(token);
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'No token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token,"dnm", (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          console.log(decoded);
          next(); // Exit middleware
        }
      });
    }
  });

  //sensitive routes
  //get ideas owned by logged in user
  router.get('/yourideas/:owner',(req,res)=>{
    
    Idea.find({"owner":req.params.owner}).then((data)=>{
         console.log(data);
         res.json(data);
      });
         
 });
 //get ideas that are not yet approved
  router.get('/needapproval',(req,res)=>{
    console.log(req.decoded.userId);
   User.findOne({'_id':req.decoded.userId}).then(
        (user,err)=>{
            console.log(err);
            console.log(user);
            if(user.admin)
             {
                 console.log("searching ...")
                Idea.find({'dateApproved':{$exists:false}}).sort({"dateCreated":-1}).then((data)=>{
                    console.log(data);
                    res.json(data)}); 
             }}
    );
   
    
       
})
//post a new idea
router.post('/',(req,res)=>
{
   
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
//approve idea by setting approval date given its id
router.put('/approve/:ideaId',(req,res)=>
{
    console.log(req.params.ideaId);
      Idea.findByIdAndUpdate({'_id':req.params.ideaId},{$set:{dateApproved:new Date()}}).then((data)=>{res.json(data)});
})
//delete an idea
router.delete('/delete/:ideaId',(req,res)=>
{
    Idea.findOneAndRemove({'_id':req.params.ideaId}).then((data)=>{res.json(data)});
})
//@Brian
//Adding a comment to an idea
router.post('/comment', (req, res) => 
{
    
    var dateCreated=new Date();
    var theId= req.body.ideaId;
    var username= req.body.ownerUsername;
    var comment = req.body.comment;
        
    Idea.findByIdAndUpdate({"_id" : theId}, { $addToSet: {thoughts:{owner: username, text: comment, dateofth: new Date()}},$inc:{commentCount:1}}).then((data)=>{res.json(data)});

})
//Adding a rating to an idea

router.post('/rating/:ideaId', (req, res) => 
{
    
    var theId= req.params.ideaId;
    var rating= req.body;
    console.log(theId);
    console.log(rating);
           
    Idea.findByIdAndUpdate({"_id" : theId}, { $addToSet: {ratings:{rater:rating.rater,rating:rating.rating,dateofr:rating.dateofr}},$inc:{total:rating.rating,rateCount:1}}).
    then((data,err)=>{
        console.log(err);
        if(!err) console.log("rating is added");
        console.log(data);
        res.json(data)
    }).catch((err)=>{console.log(err);})

})

//@Brian
//Deleting a comment from the an idea
router.put('/deletecomment',(req,res)=>
{
    var theId= req.body.ideaId;
    var username= req.body.owner;
    var thethought= req.body.thoughtText;
    var thecommentDate= req.body.commentDate;

    var theThoughtObject = {owner: username, text: thethought, dateofth: thecommentDate};

    console.log(theThoughtObject);

    Idea.findByIdAndUpdate({'_id':theId}, {$pull : {"thoughts" : theThoughtObject}}).then((data)=>{res.json(data)});
})
//@Brian
//retrieve an image
router.get('/image', (req, res)=>
{
    res.sendFile('img/life.jpg'); 
})

module.exports=router;

const Idea = require('../models/idea'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const router=require('express').Router();
const User = require('../models/user'); 

router.get('/',(req,res)=>{
    
    Idea.find({}).then((data)=>{res.json(data)});
    
})
router.get('/approved',(req,res)=>{
    
    Idea.find({'dateApproved':{$exists:true}}).then((data)=>{res.json(data)});
    
})



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

  router.get('/needapproval',(req,res)=>{
    console.log(req.decoded.userId);
   User.findOne({'_id':req.decoded.userId}).then(
        (user,err)=>{
            console.log(err);
            console.log(user);
            if(user.admin)
             {
                 console.log("searching ...")
                Idea.find({'dateApproved':{$exists:false}}).then((data)=>{
                    console.log(data);
                    res.json(data)}); 
             }}
    );
   
    
       
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

//Adding a comment to an idea
router.post('/comment', (req, res) => 
{
    
    var dateCreated=new Date();
    var theId= req.body.ideaId;
    var username= req.body.ownerUsername;
    var comment = req.body.comment;
        
    Idea.findByIdAndUpdate({"_id" : theId}, { $addToSet: {thoughts:{owner: username, text: comment, dateofth: new Date()}}}).then((data)=>{res.json(data)});

})

//Deleting a comment from the database
router.put('/deletecomment',(req,res)=>
{
    var theId= req.body.ideaId;
    var username= req.body.ownerUsername;
    var theCommentPosition = 'thoughts.'+req.body.thoughtIndexNo;

    //res.send(theCommentPosition);
    Idea.findByIdAndUpdate({'_id':theId},{$unset : {"thoughts.2": 1 }}).then((data)=>{res.json(data)});
    //Idea.findByIdAndUpdate({'_id':theId}, {$pull : {"thoughts" : null}}).then((data)=>{res.json(data)});

    //Idea.findByIdAndUpdate({'_id':theId}, {$pull : {"thoughts" : null}}).then((data)=>{res.json(data)});
})

module.exports=router;

const User = require('../models/user'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const router=require('express').Router();
router.get('/',(req,res)=>{
    
    User.findOne({}).then((data)=>{res.json(data)});
    
})
//Add a new user
router.post('/add',(req,res)=>
{
    const user=new User({email:req.body.email,username:req.body.username,password:req.body.password});
    user.save((err)=>{
        if(err) 
        {
            console.log(err.message);
            res.json({success:false});
        }
        else
        {
            res.json({success:true});
        }})
})

  //Get all user profiles

  router.get('/getusers', (req, res) => {
    // Search for users in database
    User.find({}).then((data)=>{res.json(data)});
  });

  //Make a user an administrator
  router.put('/makeadmin/:theuser', (req,res)=>
{
    console.log(req.params.theuser);
      User.update({'username':req.params.theuser},{$set:{admin: true}}).then((data)=>{res.json(data)});
})


  router.post('/login', (req, res) => {
   
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
            if (err) {
            res.json({ success: false, message: err }); 
          }  else {
              const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
              // Check if password is a match
              if (!validPassword) {
                res.json({ success: false, message: 'Password invalid' }); // Return error
              } else {
                const token = jwt.sign({ userId: user._id }, "dnm", { expiresIn: '24h' }); // Create a token for client
                res.json({
                  success: true,
                  message: 'Success!',
                  token: token,
                  user: {
                    username: user.username,admin:user.admin?1:0
                  }
                }); // Return success and token to frontend
              }
            }
          }
        });
        
  });

 

module.exports=router;

  const express = require("express");
  const router = express.Router();
  const userdata = require('../Models/SignupModel');
  const bcrypt = require("bcrypt")
  const session = require("express-session")
  const { body, validationResult } = require('express-validator');
  const bodyParser = require('body-parser');
  router.use(bodyParser.json());
  const MongoStore = require('connect-mongo');


  const Item = require("../Models/MenuModel")

  router.use(express.json());

  router.use(session({
      secret: 'hatim@123',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.DATABASE,
      }),
      cookie: { secure: process.env.NODE_ENV === 'production'}
    }));



const destroySessionOnLoad = (req, res, next) => {
      
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
        next();
      });
    };

router.get('/logout', destroySessionOnLoad, (req, res) => {
      res.send('Session destroyed');
    });



router.post('/signup', [
      body('firstname').notEmpty().withMessage('First name is required'),
      body('lastname').notEmpty().withMessage('Last name is required'),
      body('email').isEmail().withMessage('Invalid email format'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ], async(req,res)=>{

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {firstname, lastname, email, password} = req.body
      
      try {
      const check = await userdata.findOne({email});

      if(check){
      res.status(404).json({message:"Email is already register"})
      }
      else{
      
      const hashed = await bcrypt.hash(password,10)
      await userdata.create({
          firstname,
          lastname,
          email,
          password:hashed
      })
      res.status(200).json({message:"Signed up Successfully",success:true})
      }
          
      } catch (error) {
          console.log(error)
      }


  })


  router.post("/login",async(req,res)=>{
    console.log('Request Body:', req.body);
      const{email,password}=req.body
      

      try {
      const check = await userdata.findOne({email})
      if(!check){
          res.status(404).json({message:"Invalid Email or password"})
      }l
      const compare = await bcrypt.compare(password,check.password)

      if(compare){
              req.session.email = check.email;
              req.session.username = check.firstname;
              req.session.lastname = check.lastname;
              req.session.cart =  check.cart;
              req.session._id =  check._id;
              console.log('Session Data:', req.session)
              console.log('Session Data:', req.session.username)
              res.status(200).json({success:true,message:"Login Succesfully"})
      }
      else {
         res.status(400).json({ success: false, message: "Invalid Password" });
}
      } catch (error) {
         res.status(500).json({message:"Invalid"})
      }
  })



  const isAuthenticated = (req, res, next) => {
      if (req.session && req.session.email) {
        console.log('Authentication successful. Session:', req.session);
        next();
      } else {
        console.log('Authentication failed. Session:', req.session);
        res.status(401).json({ success: false, message: 'Unauthorized' });
      }
    };


router.get("/check",async(req,res)=>{
  try {
    const check = await userdata.findById(req.session._id)
  if(check){
    res.status(200).json({success:true})
  }
  else{
    res.json({success:false})
  }
  } catch (error) {
    console.log(error)
  }
  
})


  router.get('/main', isAuthenticated, (req, res) => {
      console.log('User authenticated. Session:', req.session);
      res.status(200).json({ username:{first:req.session.username,last:req.session.lastname}, success: true, message: 'Authenticated. Welcome to the main page!' });
    });



  router.get("/menu", async(req,res)=>{
    const Data = await Item.find()
    if(Data){
      res.status(200).json({success:true,menu:Data})
    }
    else{
      res.status(400).json({success:false,message:"DATA NOT FOUND"})
    }
  })


  

  router.post("/cart",isAuthenticated,async(req,res)=>{

    const{id,Title,img,Descrpition,Price,amount}=req.body
    
    try {
     const user = await userdata.findById(req.session._id)
     const check =  user.cart.some((item)=>item.id === id)
     if(!check){
      await userdata.findByIdAndUpdate(
        req.session._id,
      {
        $push: {
          cart: { id, Title, img, Descrpition, Price, amount },
     },
    },{
      new:true
    }
     )
        res.status(200).json({success:true,cart:user.cart})
     }
    //  else{
    //   res.send({Alert:true})
    // }
    res.status(400).json({message:"Already added"}) 
  }
    catch (error) {
      console.log(error)
    }
})

router.post("/amount",isAuthenticated, async(req,res)=>{

  const{id,amount}=req.body

  try {
    const userId = req.session._id

     await userdata.updateOne(
      { "_id": userId, "cart.id": id },
      { $set: { "cart.$.amount": amount }}
    );
    res.status(200).json({success:true})
  } catch (error) {
    console.log(error)
  }

})



  router.delete("/delete", isAuthenticated, async (req, res) => {
    const{id}=req.query
  
    try {
      const user = await userdata.findById(req.session._id);
    
      if(user){
        await user.updateOne({
          $pull :{
            cart:{id}
          }
        });
        res.json({success:true, cart:user.cart})
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get("/upd",async(req,res)=>{
    try {
      const user = await userdata.findById(req.session._id)
      if(user){
        const response = user.cart
        res.status(200).json({cart:response})
      }
      else{
        res.status(400).json({success:false})
      }
    } catch (error) {
      res.status(403).json(error)
    }
   
  })

  



  module.exports=router;

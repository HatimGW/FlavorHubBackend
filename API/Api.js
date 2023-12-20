//   const express = require("express");
//   const router = express.Router();
//   const userdata = require('../Models/SignupModel');
//   const bcrypt = require("bcrypt")
//   const session = require("express-session")
//   const { body, validationResult } = require('express-validator');
  
 
//   const MongoStore = require('connect-mongodb-session')(session);



//   const Item = require("../Models/MenuModel")

//   router.use(express.json());
 

//    const store = new MongoStore({
//     uri: process.env.DATABASE,
//     collection: "sessions"
//   });
  
//   router.use(session({
//       secret: process.env.SECRET_KEY,
//       resave: false,
//       saveUninitialized: false,
//       store: store,
//       cookie: { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 48, sameSite: 'none' } 
//     }));



// // const destroySessionOnLoad = (req, res, next) => {
      
// //       req.session.destroy((err) => {
// //         if (err) {
// //           console.error('Error destroying session:', err);
// //         }
// //         next();
// //       });
// //     };

// // router.get('/logout', destroySessionOnLoad, (req, res) => {
// //       res.send('Session destroyed');
// //     });

// const destroySessionOnLoad = (req, res, next) => {
//   // Destroy the session
//   req.session.destroy((err) => {
//     if (err) {
//       console.error('Error destroying session:', err);
//     }

//     // Clear session-related cookies
//     res.clearCookie('isAuth');
//     res.clearCookie('_id');
//     res.clearCookie('firstname');
//     res.clearCookie('lastname');
//     res.clearCookie('email');

//     next();
//   });
// };

// router.get('/logout', destroySessionOnLoad, (req, res) => {
//   res.send('Session destroyed');
// });



// router.post('/signup', [
//       body('firstname').notEmpty().withMessage('First name is required'),
//       body('lastname').notEmpty().withMessage('Last name is required'),
//       body('email').isEmail().withMessage('Invalid email format'),
//       body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//     ], async(req,res)=>{

//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       const {firstname, lastname, email, password} = req.body
      
//       try {
//       const check = await userdata.findOne({email});

//       if(check){
//       res.status(404).json({message:"Email is already register"})
//       }
//       else{
      
//       const hashed = await bcrypt.hash(password,10)
//       await userdata.create({
//           firstname,
//           lastname,
//           email,
//           password:hashed
//       })
//       res.status(200).json({message:"Signed up Successfully",success:true})
//       }
          
//       } catch (error) {
//           console.log(error)
//       }


//   })


//   // router.post("/login",async(req,res)=>{
//   //     const{email,password}=req.body

//   //     try {
//   //     const check = await userdata.findOne({email})
//   //     if(!check){
//   //         res.status(404).json({message:"Invalid Email or password"})
//   //     }else{
//   //     const compare = await bcrypt.compare(password,check.password)

//   //     if(compare){
//   //         req.session.isAuth = true;
//   //         req.session._id = check._id
//   //         req.session.firstname = check.firstname
//   //         req.session.lastname = check.lastname
//   //         req.session.email = check.email
//   //             res.status(200).json({success:true, message:"Login Succesfully"})
//   //     }
//   //     else {
//   //       res.status(400).json({ message: "Invalid Credential" });
//   //     }
//   //    } } 
//   //    catch (error) {
//   //        res.status(500).json({message:"Invalid"})
//   //     }
//   // })



//   // const isAuthenticated = (req, res, next) => {
//   //     if (req.session.isAuth) {
//   //       console.log('Authentication successful. Session:', req.session.firstname);
//   //       next();
//   //     } else {
//   //       console.log('Authentication failed. Session:', req.session.firstname);
//   //       res.status(401).json({ success: false, message: 'Unauthorized' });
//   //     }
//   //   };

//   router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       const check = await userdata.findOne({ email });
  
//       if (!check) {
//         res.status(404).json({ message: "Invalid Email or password" });
//       } else {
//         const compare = await bcrypt.compare(password, check.password);
  
//         if (compare) {
//           // Set session variables in cookies after successful login
//           res.cookie('isAuth', true,{ secure: true, httpOnly: true });
//           res.cookie('_id', check._id,{ secure: true, httpOnly: true });
//           res.cookie('firstname', check.firstname,{ secure: true, httpOnly: true });
//           res.cookie('lastname', check.lastname,{ secure: true, httpOnly: true });
//           res.cookie('email', check.email,{ secure: true, httpOnly: true });
  
//           res.status(200).json({ success: true, message: "Login Successfully" });
//         } else {
//           res.status(400).json({ message: "Invalid Credentials" });
//         }
//       }
//     } catch (error) {
//       res.status(500).json({ message: "Invalid" });
//     }
//   });
  
//   const isAuthenticated = (req, res, next) => {
//     if (req.cookies.isAuth) {
//       console.log('Authentication successful. Session:', req.cookies.firstname);
//       next();
//     } else {
//       console.log('Authentication failed. Session:', req.cookies.firstname);
//       res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
//   };


// router.get("/check",isAuthenticated,async(req,res)=>{
//   try {
//     if(req.cookies.isAuth){
//     res.status(200).json({success:true})
//   }
//   else{
//     res.json({success:false})
//   }
//   } catch (error) {
//     console.log(error)
//   }
  
// })


//   router.get('/main', isAuthenticated, (req, res) => {
//       console.log('User authenticated. Session:', req.cookies.firstname);
//       res.status(200).json({ username:{first:req.cookies.firstname,last:req.cookies.lastname}, success: true, message: 'Authenticated. Welcome to the main page!' });
//     });



//   router.get("/menu", async(req,res)=>{
//     const Data = await Item.find()
//     if(Data){
//       res.status(200).json({success:true,menu:Data})
//     }
//     else{
//       res.status(400).json({success:false,message:"DATA NOT FOUND"})
//     }
//   })


  

//   router.post("/cart",isAuthenticated,async(req,res)=>{

//     const{id,Title,img,Descrpition,Price,amount}=req.body
    
//     try {
//      const user = await userdata.findById(req.cookies._id)
//      const check =  user.cart.some((item)=>item.id === id)
//      if(!check){
//       await userdata.findByIdAndUpdate(
//         req.cookies._id,
//       {
//         $push: {
//           cart: { id, Title, img, Descrpition, Price, amount },
//      },
//     },{
//       new:true
//     }
//      )
//         res.status(200).json({success:true,cart:user.cart})
//      }
//      else{
//       res.send({Alert:true})
//     }
//     res.status(400).json({message:"Already added"}) 
//   }
//     catch (error) {
//       console.log(error)
//     }
// })

// router.post("/amount",isAuthenticated, async(req,res)=>{

//   const{id,amount}=req.body

//   try {
//     const userId = req.cookies._id

//      await userdata.updateOne(
//       { "_id": userId, "cart.id": id },
//       { $set: { "cart.$.amount": amount }}
//     );
//     res.status(200).json({success:true})
//   } catch (error) {
//     console.log(error)
//   }

// })



//   router.delete("/delete", isAuthenticated, async (req, res) => {
//     const{id}=req.query
  
//     try {
//       const user = await userdata.findById(req.cookies._id);
    
//       if(user){
//         await user.updateOne({
//           $pull :{
//             cart:{id}
//           }
//         });
//         res.json({success:true, cart:user.cart})
//       }
      
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });

//   router.get("/upd",async(req,res)=>{
//     try {
//       const user = await userdata.findById(req.cookies._id)
//       if(user){
//         const response = user.cart
//         res.status(200).json({cart:response})
//       }
//       else{
//         res.status(400).json({success:false})
//       }
//     } catch (error) {
//       res.status(403).json(error)
//     }
   
//   })

  



//   module.exports=router;


const express = require("express");
const router = express.Router();
const userdata = require('../Models/SignupModel');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const Item = require("../Models/MenuModel");

router.use(express.json());

// Authentication middleware to verify JWT token
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};
const destroyCookiesOnLogout = (req, res, next) => {
  // Clear user-related cookies
  res.clearCookie('token');
  res.clearCookie('isAuth');
  res.clearCookie('_id');
  res.clearCookie('firstname');
  res.clearCookie('lastname');
  res.clearCookie('email');

  // Continue to the next middleware or endpoint
  next();
};

// Logout endpoint
router.get('/logout', destroySessionOnLogout, (req, res) => {
  res.status(200).json({ success: true, message: 'Logout successful' });
});

router.post("/signup", [
  body('firstname').notEmpty().withMessage('First name is required'),
  body('lastname').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, email, password } = req.body;

  try {
    const check = await userdata.findOne({ email });

    if (check) {
      res.status(404).json({ message: "Email is already registered" });
    } else {
      const hashed = await bcrypt.hash(password, 10);
      await userdata.create({
        firstname,
        lastname,
        email,
        password: hashed
      });
      res.status(200).json({ message: "Signed up Successfully", success: true });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userdata.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "Invalid Email or password" });
    } else {
      const compare = await bcrypt.compare(password, user.password);

      if (compare) {
        const token = jwt.sign(
          { userId: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000,sameSite: 'None'});
        res.status(200).json({ success: true, message: "Login Successfully" });
      } else {
        res.status(400).json({ message: "Invalid Credentials" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/check", isAuthenticated, async (req, res) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

router.get('/main', isAuthenticated, (req, res) => {
  console.log('User authenticated. Session:', req.cookies.firstname);

  // Respond with user information
  res.status(200).json({
    username: { first: req.firstname, last: req.lastname },
    success: true,
    message: 'Authenticated. Welcome to the main page!'
  });
});

router.get("/menu", async (req, res) => {
  const Data = await Item.find();

  if (Data) {
    res.status(200).json({ success: true, menu: Data });
  } else {
    res.status(400).json({ success: false, message: "DATA NOT FOUND" });
  }
});

router.post("/cart", isAuthenticated, async (req, res) => {
  const { id, Title, img, Descrpition, Price, amount } = req.body;

  try {
    const user = await userdata.findById(req.userId);
    const check = user.cart.some((item) => item.id === id);

    if (!check) {
      await userdata.findByIdAndUpdate(
        req.userId,
        {
          $push: {
            cart: { id, Title, img, Descrpition, Price, amount },
          },
        },
        {
          new: true
        }
      );
      res.status(200).json({ success: true, cart: user.cart });
    } else {
      res.send({ Alert: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/amount", isAuthenticated, async (req, res) => {
  const { id, amount } = req.body;

  try {
    await userdata.updateOne(
      { "_id": req.userId, "cart.id": id },
      { $set: { "cart.$.amount": amount } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete", isAuthenticated, async (req, res)=> {
  const { id } = req.query;

  try {
    const user = await userdata.findById(req.userId);

    if (user) {
      await user.updateOne({
        $pull: {
          cart: { id }
        }
      });
      res.json({ success: true, cart: user.cart });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/upd", async (req, res) => {
  try {
    const user = await userdata.findById(req.userId);

    if (user) {
      const response = user.cart;
      res.status(200).json({ cart: response });
    } else {
      res.status(400).json({ success: false });
    }

  } catch (error) {
    res.status(403).json(error);
  }
});

module.exports = router;


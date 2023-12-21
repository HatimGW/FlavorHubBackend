const express = require("express");
const router = express.Router();
const userdata = require('../Models/SignupModel');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const Item = require("../Models/MenuModel");

router.use(express.json());


const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.firstname = decoded.firstname;
    req.lastname = decoded.lastname;
    req.cart = decoded.cart;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};
const destroyCookiesOnLogout = (req, res, next) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None' });
  next();
};


router.get('/logout', destroyCookiesOnLogout, (req, res) => {
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
          { userId: user._id, email: user.email, cart: user.cart, firstname: user.firstname, lastname: user.lastname},
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000,sameSite: 'None'});
        res.status(200).json({ success: true, message: "Login Successfully" });
      } else {
        res.json({ message: "Invalid Credentials" });
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
  console.log('User authenticated. Session:', req.firstname);

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

router.get("/upd",isAuthenticated, async (req, res) => {
  try {
    const user = await userdata.findById(req.userId);

    if (user) {
      const response = user.cart;
      res.status(200).json({success:true, cart: response });
    } else{
      res.send({success:false})
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;


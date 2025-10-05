const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticateToken = require('../middlewares/auth');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// register new user
router.post("/register", async (req, res) => {
  try {
    const {name , email , password} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password , SALT_ROUNDS);

    const newUser = new User({
        name , 
        email , 
        password : hashedPassword
    });
    
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// login user
router.post('/login' , async (req , res) => {
    try{
        const {password , email} = req.body;
        console.log(email)
        const user = await User.findOne({email});
        // if user not found
        if(!user) return res.status(404).json({message : 'User not found'});
        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Incorrect credentials" });
        // create jwt token
        const token = jwt.sign(
            {
                id : user._id, name : user.name , email : user.email
            },JWT_SECRET,
            {
                expiresIn:'1h'
            }
        );
        res.status(200).json({message:'LogIn successfull' , token});
    }catch(err){
        return res.status(500).json({message : 'Server error'});
    };
});


module.exports = router;

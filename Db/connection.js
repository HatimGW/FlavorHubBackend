const mongoose = require("mongoose");
require('dotenv').config()

const db = process.env.DATABASE; 

mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connection Established")
})
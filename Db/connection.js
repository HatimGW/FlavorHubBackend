const mongoose = require("mongoose");

const db = "mongodb+srv://Hatim:hatim123@cluster0.x7xi2sy.mongodb.net/FlavorHub?retryWrites=true&w=majority"

mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connection Established")
})
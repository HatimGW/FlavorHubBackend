const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    firstname:{
        type:String,
        requires:true
    },
    lastname:{
        type:String,
        requires:true
    },
    email:{
        type:String,
        requires:true
    },
    password:{
        type:String,
        requires:true
    },
    cart:[
        {
            id: Number,
            Title: String,
            img: String,
            Descrpition: String,
            Price:Number,
            amount: Number
            
          }
    ]
})

const userData = mongoose.model("userData",schema)

module.exports=userData;
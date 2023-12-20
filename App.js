const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv').config();
app.use(cookieParser())
const PORT = process.env.PORT || 3001

require("./Db/connection")

app.use(cors({
    origin: 'https://flavorhub53.netlify.app',
    credentials: true, 
  }))
  // app.use(cors({
  //   origin: 'http://localhost:3000', 
  //   credentials: true, 
  // }))
  
const API = require("./API/Api");
app.use(API)
const Fetch = require("./FETCH/fetch")
app.use(Fetch)

app.listen(PORT,()=>{
  console.log(PORT)
})

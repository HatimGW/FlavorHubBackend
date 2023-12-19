const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
require('dotenv').config();
const PORT = process.env.PORT || 3001

require("./Db/connection")

app.use(cors({
    origin: 'https://flavorhub-8t8f.onrender.com', 
    credentials: true, 
  }))

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://flavorhub53.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

const API = require("./API/Api");
app.use(API)
const Fetch = require("./FETCH/fetch")
app.use(Fetch)

app.listen(PORT)
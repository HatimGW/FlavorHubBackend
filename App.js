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

const API = require("./API/Api");
app.use(API)
const Fetch = require("./FETCH/fetch")
app.use(Fetch)

app.listen(PORT)
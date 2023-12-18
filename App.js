const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
require('dotenv').config();
const PORT = process.env.PORT || 3001

require("./Db/connection")

app.use(cors({
    origin: 'http://localhost:3000', // Set the origin of your client application
    credentials: true, // Allow credentials (cookies)
  }))

// app.use('./images', express.static(path.join(__dirname, 'images')));

const API = require("./API/Api");
app.use(API)
const Fetch = require("./FETCH/fetch")
app.use(Fetch)

app.listen(PORT)
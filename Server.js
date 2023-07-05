const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const port = process.env.port || 8000
const BASE_URL = process.env.BASE_URL
const cors = require("cors")
const app = express()
app.use(cors())
// app.use(cors({ origin: "http://localhost:3000" }))



const router = require("./routes/users")
const user = require("./models/User")

// app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(router)
app.use("/uploads", express.static("./uploads"))
app.use("/files", express.static("./public/files"))

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
  // mongoose.connect('mongodb://localhost:27017/userRegistration', {
  UseNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Mongodb connected SuccessFully...!!"))
  .catch((err) => console.log(err))


app.get("/", (req, res) => {
  res.send("hello every one...!!")
})

app.listen(port, () => {
  console.log(`your server is running port no ${port}`)
})
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const connectDB = require('./config/db.js');

var cors = require('cors')



const app = express();
mongoose.set("strictQuery", false);

app.use(express.json());
app.use(cors())


const port =  3001;


//  using mongoose@6.10.0 temporarily to fix error - https://stackoverflow.com/a/75638135


// conencting to MongoDB
connectDB();


//   available routes
// app.use("/api/auth", require("./routes/auth"));

app.listen(port, function () {
    console.log("listening on port " + port);
});
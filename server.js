//////////////////////////////////
// Dependencies
/////////////////////////////////
// get .env variables
require("dotenv").config()
// pull PORT from .env, give it a default of 3000 (object destructuring)
const {PORT = 3001, DATABASE_URL} = process.env
// import express
const express = require("express")
// create the application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import middleware
const cors = require("cors")
const morgan = require("morgan")

/////////////////////////////////
// Database Connection
////////////////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

//////////////////////////////
// Models
//////////////////////////////
// the place schema
const PlaceSchema = new mongoose.Schema({
    city: String,
    country: String,
    attractions: [String],
    img: String,
    description: String
}, {timestamps: true})

const Place = mongoose.model("Place", PlaceSchema)

/////////////////////////////////
//Middleware
//////////////////////////////////
app.use(cors()) // prevent cors errors, opens up access for frontend
app.use(morgan("dev")) //logging
app.use(express.json()) // parse json bodies

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from Mongo"))
.on("error", (error) => console.log(error))

////////////////////////////////
// Routes
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("Hello World")
})

// Place index route
// get request to /place, returns all bookmarks as json
app.get("/place", async (req, res) => {
    try {
      // send all bookmarks
      res.json(await Place.find({}));
    } catch (error) {
      res.status(400).json({ error });
    }
  });

 // Place create route
// post request to /place, uses request body to make new place
app.post("/place", async (req, res) => {
    try {
      // create a new place
      res.json(await Place.create(req.body));
    } catch (error) {
      res.status(400).json({ error });
    }
  });

//  Place update  route
// put request /place/:id, updates place based on id with request body
app.put("/place/:id", async (req, res) => {
    try {
        // update a place
        res.json(await Place.findByIdAndUpdate(req.params.id, req.body, {new: true}));
      } catch (error) {
        res.status(400).json({ error });
      }
})

// Destroy Route 
// delete request to /place/:id, deletes the place specified
app.delete("/place/:id", async (req, res) => {
    try {
        // delete a place
        res.json(await Place.findByIdAndRemove(req.params.id));
      } catch (error) {
        res.status(400).json({ error });
      }
})


/////////////////////////////////
// Server Listener
/////////////////////////////////
app.listen(PORT, () => {console.log(`listening on PORT ${PORT}`)})
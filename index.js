const express = require("express")

const winston = require("winston")
require("winston-mongodb")
const config = require("config")
const mongoose = require("mongoose")
const app = express()
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)
require("./startup/logging")()
require("./startup/routes")(app)
require("./startup/db")()

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined.")
  process.exit(1)
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))

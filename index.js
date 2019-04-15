const winston = require("winston")
const express = require("express")
const app = express()

require("./startup/logging")() // first
require("./startup/routes")(app)
require("./startup/db")()
require("./startup/config")()
require("./startup/validatation")()

const port = process.env.PORT || 3000
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
)
module.exports = server

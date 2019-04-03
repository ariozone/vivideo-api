const winston = require("winston")
module.exports = function(err, req, res, next) {
  winston.log("error", "Something is wrong!")
  res.status(500).send("Something went wrong!")
}

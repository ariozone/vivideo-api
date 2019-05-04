const helmet = require("helmet")
const compression = require("compression")

module.exports = function(app) {
  app.use(helmet()) // getting middleware function
  app.use(compression())
}

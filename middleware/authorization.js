const jwt = require("jsonwebtoken")
const config = require("config")

function auth(req, res, next) {
  const token = req.header("x-auth-token")
  if (!token)
    return res
      .status(401)
      .send("User is not authorized to access! No token provided.")

  try {
    // Verifying token
    const decodedPayload = jwt.verify(token, config.get("jwtPrivateKey"))
    // Adding a user property to request body so that in the future we can access the _id property from the request.
    req.user = decodedPayload
    // Passing control to the next middleware function
    next()
  } catch (ex) {
    res.status(400).send("Token is not valid!")
  }
}

module.exports = auth

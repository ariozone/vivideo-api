const { User } = require("../../../models/user")
const jwt = require("jsonwebtoken")
const config = require("config")
const mongoose = require("mongoose")
describe("user.generateToken", () => {
  it("should return a valid token", () => {
    const user = new User({
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    })
    const token = user.generateToken()
    const decodedPayload = jwt.verify(token, config.get("jwtPrivateKey"))
    expect(decodedPayload).toMatchObject({ _id: user._id, isAdmin: true })
  })
})

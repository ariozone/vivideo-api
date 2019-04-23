const { User } = require("../../../models/user")
const jwt = require("jsonwebtoken")
const config = require("config")
const mongoose = require("mongoose")
describe("user.generateToken", () => {
  it("should return a valid token", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    }
    const user = new User(payload)
    const token = user.generateToken()
    const decodedPayload = jwt.verify(token, config.get("jwtPrivateKey"))
    expect(decodedPayload).toMatchObject(payload)
  })
})

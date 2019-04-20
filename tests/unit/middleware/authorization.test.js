const auth = require("../../../middleware/authorization")
const mongoose = require("mongoose")
const { User } = require("../../../models/user")

describe("authorization middleware", () => {
  it("should populate req.user with a payload of valid JWT", () => {
    const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
    const token = new User(user).generateToken()
    const req = {
      header: jest.fn().mockReturnValue(token)
    }
    const res = {} // We need to pass it to mock function
    const next = jest.fn()

    auth(req, res, next)
    expect(req.user).toBeDefined()
    expect(req.user).toMatchObject(user)
  })
})

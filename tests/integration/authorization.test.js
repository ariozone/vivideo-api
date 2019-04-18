const request = require("supertest")
const { Genre } = require("../../models/genre")
const { User } = require("../../models/user")
const jwt = require("jsonwebtoken")

describe("authorization middleware", () => {
  beforeEach(() => {
    server = require("../../index")
  })
  afterEach(() => server.close())
})

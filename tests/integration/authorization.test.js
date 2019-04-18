const request = require("supertest")
const { Genre } = require("../../models/genre")
const { User } = require("../../models/user")

describe("authorization middleware", () => {
  beforeEach(() => {
    server = require("../../index")
  })
  afterEach(() => server.close())
  it("should return 401 if no token is provided.", async () => {
    const response = await request(server)
      .post("/api/genres")
      .send({ name: "genre1" })
    expect(response.status).toBe(401)
  })
})

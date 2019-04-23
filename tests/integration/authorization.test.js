const request = require("supertest")
const { Genre } = require("../../models/genre")
const { User } = require("../../models/user")

describe("authorization middleware", () => {
  let server
  beforeEach(() => {
    server = require("../../index")
  })

  afterEach(async () => {
    await Genre.remove({})
    await server.close()
  })

  it("should return 401 if no token is provided.", async () => {
    const response = await request(server)
      .post("/api/genres")
      .send({ name: "genre1" })
    expect(response.status).toBe(401)
  })

  it("should return 400 if the provided token is invalid.", async () => {
    const response = await request(server)
      .post("/api/genres")
      .set("x-auth-token", 1)
      .send({ name: "genre1" })
    expect(response.status).toBe(400)
  })

  it("should return 200 if a valid token provided.", async () => {
    const token = new User().generateToken()
    const response = await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" })
    expect(response.status).toBe(200)
  })
})

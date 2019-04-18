const request = require("supertest")

describe("authorization middleware", () => {
  it("should return 401 if no token is provided.", async () => {
    const response = await request(server)
  })
})

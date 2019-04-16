const request = require("supertest")
const { Genre } = require("../../models/genre")
let server

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index")
  })
  afterEach(() => {
    server.close()
  })
  describe("genres.GET/", () => {
    it("should return all genres.", async () => {
      const genre1 = await new Genre({ name: "genre1" })
      const genre2 = await new Genre({ name: "genre2" })
      await genre1.save()
      await genre2.save()
      const response = await request(server).get("/api/genres")
      expect(response.status).toBe(200)
    })
  })
})

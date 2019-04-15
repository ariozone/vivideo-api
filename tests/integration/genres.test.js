const request = require("supertest")
let server

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index")
  })
  afterEach(() => {
    server.close()
  })
  describe("genres.GET/", () => {
    it("should return all genres.", () => {})
  })
})

const request = require("supertest")
const { Rental } = require("../../models/rental")
describe("Returns Api", () => {
  let server
  beforeEach(() => {
    server = require("../../index")
  })
  afterEach(async () => {
    await server.close()
  })
  it("should test the returns api.", () => {})
})

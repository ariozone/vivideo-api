const request = require("supertest")
const { Rental } = require("../../models/rental")
describe("Returns Api", () => {
  let server
  beforeEach(async () => {
    server = require("../../index")
    const rental = new Rental({
      customer: {},
      movie: {}
    })
    await rental.save()
  })
  afterEach(async () => {
    await server.close()
  })
  it("should test the returns api.", () => {})
})

const request = require("supertest")
const { Rental } = require("../../models/rental")
const mongoose = require("mongoose")
describe("Returns Api", () => {
  let server

  beforeEach(async () => {
    server = require("../../index")
    const rental = new Rental({
      customer: {
        _id: mongoose.Types.ObjectId(), //neet id for tests
        name: "123",
        contact: "12345"
      },
      movie: {
        _id: mongoose.Types.ObjectId(),
        title: "123",
        dailyRentalRate: 1
      }
    })
    await rental.save()
  })

  afterEach(async () => {
    await server.close()
    await Rental.remove({})
  })
  it("should test the returns api.", () => {})
})

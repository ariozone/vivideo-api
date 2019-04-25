const request = require("supertest")
const { Rental } = require("../../models/rental")
const { User } = require("../../models/user")
const mongoose = require("mongoose")
describe("Returns Api", () => {
  let server
  let rental
  let customerId
  let movieId
  beforeEach(async () => {
    server = require("../../index")
    customerId = mongoose.Types.ObjectId() //neet id for tests
    movieId = mongoose.Types.ObjectId()
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "123",
        contact: "12345"
      },
      movie: {
        _id: movieId,
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
  it("should return 401 if the user is not logged in.", async () => {
    const response = await request(server)
      .post("/api/returns")
      .send({})
    expect(response.status).toBe(401)
  })
  it("should return 400 if the customerId is not provided.", async () => {
    const token = new User().generateToken()
    const response = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ movieId })
    expect(response.status).toBe(400)
  })
  it("should return 400 if the movieId is not provided.", async () => {
    const token = new User().generateToken()
    const response = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId })
    expect(response.status).toBe(400)
  })
  it("should return 404 if no rental exist for customer/movie.", async () => {
    await Rental.remove({}) // clear the created rental first
    const token = new User().generateToken()
    const response = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId })
    expect(response.status).toBe(404)
  })
})

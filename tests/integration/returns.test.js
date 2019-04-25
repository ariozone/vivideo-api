const request = require("supertest")
const { Rental } = require("../../models/rental")
const { User } = require("../../models/user")
const { Movie } = require("../../models/movie")
const mongoose = require("mongoose")
const moment = require("moment")

describe("Returns Api", () => {
  let server
  let rental
  let movie
  let customerId
  let movieId
  let token

  beforeEach(async () => {
    server = require("../../index")
    customerId = mongoose.Types.ObjectId() //need id for tests
    movieId = mongoose.Types.ObjectId()
    token = new User().generateToken()

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

    movie = new Movie({
      _id: movieId,
      title: "12",
      genre: { name: "123" },
      numberInStock: 10,
      dailyRentalRate: 1
    })

    await rental.save()
    await movie.save()
  })

  afterEach(async () => {
    await server.close()
    await Rental.remove({})
    await Movie.remove({})
  })

  it("should return 401 if the user is not logged in.", async () => {
    token = ""
    const response = await request(server)
      .post("/api/returns")
      .send({})
    expect(response.status).toBe(401)
  })

  it("should return 400 if the customerId is not provided.", async () => {
    const response = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ movieId })
    expect(response.status).toBe(400)
  })

  it("should return 400 if the movieId is not provided.", async () => {
    const response = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId })
    expect(response.status).toBe(400)
  })

  it("should return 404 if no rental exist for customer/movie.", async () => {
    await Rental.remove({}) // clear the created rental first
    const response = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId })
    expect(response.status).toBe(404)
  })

  it("should return 400 if the rental is already processed", async () => {
    rental.dateBack = new Date()
    await rental.save()
    const response = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId })
    expect(response.status).toBe(400)
  })

  it("should return 200 if the request is valid.", async () => {
    const response = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId })
    expect(response.status).toBe(200)
  })

  it("should assign a return date if request is valid.", async () => {
    await request(server)
      .set("x-auth-token", token)
      .send({ customerId, movieId })
    const rentalInDb = await Rental.findById(rental._id)
    const date = new Date()
    const timeAmount = date - rentalInDb.dateBack
    expect(rentalInDb.dateBack).toBeDefined()
    expect(timeAmount).toBeLessThan(10000)
  })

  it("should return the rental fee if input is valid.", async () => {
    rental.dateOut = moment()
      .add(-7, "days")
      .toDate() //returns moment object for 7 days before, then converts it to js date object
    await rental.save()
    await request(server)
      .post("/api/returns")
      .set("a-auth-token", token)
      .send({ customerId, movieId })
    const rentalInDb = await Rental.findById(rental._id)
    expect(rentalInDb.rentalFee).toBeDefined()
    expect(rentalInDb.rentalFee).toBe(7 * rentalInDb.movie.dailyRentalRate)
  })

  it("should add the movie to stock.", async () => {
    await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId })
    const movieInDb = await Movie.findById(movieId)
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
  })

  it("should return the rental in the body of the response.", async () => {
    const response = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId })
    const rentalInDb = await Rental.findById(rental._id)

    expect(response.body).toHaveProperty("dateOut")
    expect(response.body).toHaveProperty("dateBack")

    expect(response.body).toHaveProperty("customer", rentalInDb.customer)
    expect(response.body).toHaveProperty("movie", rentalInDb.movie)
    expect(response.body).toHaveProperty("rentalFee", rentalInDb.rentalFee)
    // or
    expect(response.body).toMatchObject({
      customer: rentalInDb.customer,
      movie: rentalInDb.movie,
      rentalFee: rentalInDb.rentalFee
    })
  })
})

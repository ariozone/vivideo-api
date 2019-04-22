const request = require("supertest")
const { Genre } = require("../../models/genre")
const { User } = require("../../models/user")
const mongoose = require("mongoose")

describe("/api/genres", () => {
  let server
  beforeEach(() => {
    server = require("../../index")
  })
  afterEach(async () => {
    server.close()
    await Genre.remove({})
  })

  describe("genres.GET /", () => {
    it("should return all genres.", async () => {
      // Instead of this:
      // const genre1 = await new Genre({ name: "genre1" })
      // const genre2 = await new Genre({ name: "genre2" })
      // await genre1.save()
      // await genre2.save()
      //We can add multiple documents to mongodb in one go:
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ])
      const response = await request(server).get("/api/genres")
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(2)
      expect(response.body.some(genre => genre.name === "genre1")).toBe(true)
      expect(response.body.some(genre => genre.name === "genre1")).toBeTruthy()
    })
  })

  describe("genres.GET /:id", () => {
    it("should return the genre if id is valid", async () => {
      const genre = new Genre({
        // MongoDB assigns an '_id' itself
        name: "genre1"
      })
      await genre.save()
      const response = await request(server).get("/api/genres/" + genre._id)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("name", genre.name)
    })

    it("should return 404 if the id is not valid.", async () => {
      // no need to create genre to test a valid id.
      const response = await request(server).get("/api/gernes/1")
      expect(response.status).toBe(404)
    })

    it("should return 404 if no genre with the given id exists.", async () => {
      const id = mongoose.Types.ObjectId()
      const response = await request(server).get("/api/genres/" + id)
      expect(response.status).toBe(404)
    })
  })

  describe("genres.POST /", () => {
    it("should return 401 if the user is not logged in.", async () => {
      const response = await request(server)
        .post("/api/genres")
        .send({ name: "genre1" })
      expect(response.status).toBe(401)
    })

    it("should return 400 if the genre is less than 3 characters.", async () => {
      const token = new User().generateToken()
      const response = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "g1" })
      expect(response.status).toBe(400)
    })

    it("should return 400 if genre is more than 50 characters.", async () => {
      const token = new User().generateToken()
      const name = new Array(52).join("a")
      const response = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name })
      expect(response.status).toBe(400)
    })

    it("should save the genre if it is valid.", async () => {
      const token = new User().generateToken()
      await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" })
      const genre = await Genre.find({ name: "genre1" })
      expect(genre).not.toBe(null)
    })

    it("should return the genre if it is valid.", async () => {
      const token = new User().generateToken()
      const response = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" })
      expect(response.body).toHaveProperty("_id") // _id indicates the existance
      expect(response.body).toHaveProperty("name", "genre1")
    })
  })

  describe("genre.PUT /:id", () => {
    it("should return 401 if the user is not logged in.", async () => {
      const id = mongoose.Types.ObjectId()
      const genre = new Genre({ _id: id, name: "genre1" })
      await genre.save()
      const response = await request(server).put("/api/genres/" + id)
      expect(response.status).toBe(401)
    })
    it("should return 400 if the new genre input is invalid.", async () => {
      const token = new User().generateToken()
      const id = mongoose.Types.ObjectId()
      const genre = new Genre({ _id: id, name: "" })
      const response = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send(genre)
      expect(response.status).toBe(400)
    })
  })
})

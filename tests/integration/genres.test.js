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
    await server.close()
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
    it("should return 400 if the new genre name is less than 3 characters.", async () => {
      const token = new User().generateToken()
      const id = mongoose.Types.ObjectId()
      const genre1 = new Genre({ _id: id, name: "genre1" })
      await genre1.save()

      const response = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: "g2" })
      expect(response.status).toBe(400)
    })
    it("should return 400 if the new genre name is more than 50 characters.", async () => {
      const token = new User().generateToken()
      const id = mongoose.Types.ObjectId()
      const genre = new Genre({ _id: id, name: "genre1" })
      await genre.save()
      const name = new Array(52).join("a")
      const response = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name })
      expect(response.status).toBe(400)
    })
    it("should return 404 if the id is not valid.", async () => {
      const token = new User().generateToken()
      const response = await request(server)
        .put("/api/genres/1")
        .set("x-auth-token", token)
        .send({ name: "genre1" })
      expect(response.status).toBe(404)
    })
    it("should return 404 if the genre with the given id does not exist.", async () => {
      const token = new User().generateToken()
      const id1 = mongoose.Types.ObjectId()
      const id2 = mongoose.Types.ObjectId()
      const genre1 = new Genre({ _id: id1, name: "genre1" })
      await genre1.save()
      const response = await request(server)
        .put("/api/genres/" + id2)
        .set("x-auth-token", token)
        .send({ name: "genre2" })
      expect(response.status).toBe(404)
    })
    it("should update the genre in database if input is valid.", async () => {
      const token = new User().generateToken()
      const genre = new Genre({ name: "genre1" })
      await genre.save()
      const id = genre._id
      const response = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: "genre2" })
      const newGenre = await Genre.findById(id)
      expect(newGenre.name).toBe("genre2")
      expect(response.status).toBe(200)
    })
    it("should return the updated genre if the input is valid.", async () => {
      const token = new User().generateToken()
      const genre = new Genre({ name: "genre1" })
      await genre.save()
      const id = genre._id
      const response = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: "genre2" })
      expect(response.body).toHaveProperty("_id")
      expect(response.body).toHaveProperty("name", "genre2")
    })
  })

  describe("genre.DELETE /:id", () => {
    it("should return 401 if the user is not logged in.", async () => {
      const id = mongoose.Types.ObjectId()
      const response = await request(server).delete("/api/genres/" + id)
      expect(response.status).toBe(401)
    })
    it("should return 403 if the logged in user is not an admin.", async () => {
      const token = new User().generateToken()
      const id = mongoose.Types.ObjectId()
      const response = await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
      expect(response.status).toBe(403)
    })
  })
})

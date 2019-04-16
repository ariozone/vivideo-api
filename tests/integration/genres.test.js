const request = require("supertest")
const { Genre } = require("../../models/genre")
const mongoose = require("mongoose")
let server

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index")
  })
  afterEach(async () => {
    server.close()
    await Genre.remove({})
  })
  describe("genres.GET/", () => {
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
  describe("genres.GET/:id", () => {
    it("should return the genre if id is valid", async () => {
      const genre = new Genre({
        name: "genre1"
      })
      await genre.save()
      const response = await request(server).get("/api/genres/" + genre._id)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("name", "genre1")
    })
  })
})

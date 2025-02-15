import request from "supertest"
import app from "../../app"

describe("Test the root path", () => {
    test("It should response the GET method", async () => {
        const response = await request(app).get("/health")
        expect(response.statusCode).toBe(200)
    })
})

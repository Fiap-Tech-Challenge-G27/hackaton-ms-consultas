import request from "supertest"
import app from "../../app"
import { signIn } from "../../utils/tests/auth"
import { patient_1 } from "../../utils/tests/objectMothers/patientsMother"
import { doctor_1 } from "../../utils/tests/objectMothers/doctorsMother"

describe("PATCH /approval-status", () => {
    it("Unauthorized to patient", async () => {
        const token = signIn(patient_1)
        const response = await request(app)
            .patch("/appointments/approval-status")
            .set("authorization", `Bearer ${token}`)
            .send({})

        expect(response.statusCode).toBe(403)
    })
    it("Authorized to doctor", async () => {
        const token = signIn(doctor_1)
        const response = await request(app)
            .patch("/appointments/approval-status")
            .set("authorization", `Bearer ${token}`)
            .send({})

        expect(response.statusCode).not.toBe(401)
        expect(response.statusCode).not.toBe(403)
    })
})

describe("POST /", () => {
    it("Authorized to patient", async () => {
        const token = signIn(patient_1)
        const response = await request(app)
            .post("/appointments")
            .set("authorization", `Bearer ${token}`)
            .send({})

        expect(response.statusCode).not.toBe(401)
        expect(response.statusCode).not.toBe(403)
    })
    it("Unauthorized to doctor", async () => {
        const token = signIn(doctor_1)
        const response = await request(app)
            .post("/appointments")
            .set("authorization", `Bearer ${token}`)
            .send({})

        expect(response.statusCode).toBe(403)
    })
})

import request from "../../utils/tests/custom_request"
import { doctor_1 } from "../../utils/tests/objectMothers/doctorsMother"
import { patient_1 } from "../../utils/tests/objectMothers/patientsMother"

describe("PATCH /approval-status", () => {
    it("Unauthorized to patient", async () => {
        const response = await request(patient_1)
            .patch("/appointments/approval-status")
            .send({})

        expect(response.statusCode).toBe(403)
    })
    it("Authorized to doctor", async () => {
        const response = await request(doctor_1)
            .patch("/appointments/approval-status")
            .send({})

        expect(response.statusCode).not.toBe(401)
        expect(response.statusCode).not.toBe(403)
    })
})

describe("POST /", () => {
    it("Authorized to patient", async () => {
        const response = await request(patient_1).post("/appointments").send({})

        expect(response.statusCode).not.toBe(401)
        expect(response.statusCode).not.toBe(403)
    })
    it("Unauthorized to doctor", async () => {
        const response = await request(doctor_1).post("/appointments").send({})

        expect(response.statusCode).toBe(403)
    })
})

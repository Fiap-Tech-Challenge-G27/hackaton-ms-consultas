import request from "../../utils/tests/custom_request"
import { appointment_1 } from "../../utils/tests/objectMothers/appointmentsMother.js"
import { doctor_1 } from "../../utils/tests/objectMothers/doctorsMother"
import { patient_1 } from "../../utils/tests/objectMothers/patientsMother"
import appointmentSchema from "./model.js"

describe("PATCH /approval-status", () => {
    it("Unauthorized to patient", async () => {
        await request(patient_1)
            .patch("/appointments/approval-status")
            .send({})
            .expect(403)
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
        const payload = {
            doctorCRM: appointment_1.doctor.crm,
            appointmentStart: appointment_1.appointmentStart,
        }

        await request(appointment_1.patient)
            .post("/appointments")
            .send(payload)
            .expect(200)

        await expect(appointmentSchema).hasOneDocumentWith({
            patientCPF: appointment_1.patient.cpf,
            ...payload,
        })
    })
    it("Unauthorized to doctor", async () => {
        await request(doctor_1).post("/appointments").send({}).expect(403)
    })
})

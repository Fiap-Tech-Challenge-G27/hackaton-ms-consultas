import request from "../../utils/tests/custom_request"
import {
    appointment_1,
    appointment_2,
    transformAppointmentToDTO,
} from "../../utils/tests/objectMothers/appointmentsMother.js"
import { doctor_1 } from "../../utils/tests/objectMothers/doctorsMother"
import { patient_1 } from "../../utils/tests/objectMothers/patientsMother"
import appointmentSchema from "./model.js"

function copyDocumentWithout(document, ...args) {
    const copy = { ...document }

    for (let arg of args) {
        delete copy[arg]
    }

    return copy
}

describe("GET /", () => {
    let appointment_dto_1
    let appointment_dto_2
    beforeEach(async () => {
        appointment_dto_1 = await appointmentSchema.create(
            transformAppointmentToDTO(appointment_1)
        )
        await appointmentSchema.create(transformAppointmentToDTO(appointment_2))

        appointment_dto_1 = copyDocumentWithout(appointment_dto_1._doc, "__v")
    })

    it("As patient", async () => {
        const response = await request(patient_1).get("/appointments")

        expect(response.body).toStringEqual([appointment_dto_1])
    })
    it("As doctor", async () => {
        const response = await request(doctor_1).get("/appointments")

        expect(response.body).toStringEqual([appointment_dto_1])
    })
})

describe("PATCH /approval-status", () => {
    it("Unauthorized to patient", async () => {
        await request(patient_1)
            .patch("/appointments/1234/approval-status")
            .send({})
            .expect(403)
    })

    const testChangeValue = (value) => {
        return async () => {
            const appointmentDTO = transformAppointmentToDTO(appointment_1)

            const { _id } = await appointmentSchema.create(appointmentDTO)

            await request(appointment_1.doctor)
                .patch(`/appointments/${_id}/approval-status`)
                .send({
                    approvalStatus: value,
                })
                .expect(200)

            const { approvalStatus } = await appointmentSchema.findById(_id)
            expect(approvalStatus).toBe(value)
        }
    }
    it("Doctor can approve", testChangeValue("approved"))

    it("Doctor can reject", testChangeValue("rejected"))
})

describe("POST /", () => {
    it("Authorized to patient", async () => {
        const appointmentDTO = transformAppointmentToDTO(appointment_1)

        await request(appointment_1.patient)
            .post("/appointments")
            .send(copyDocumentWithout(appointmentDTO, "patientCPF"))
            .expect(200)

        await expect(appointmentSchema).hasOneDocumentWith(appointmentDTO)
    })
    it("Unauthorized to doctor", async () => {
        await request(doctor_1).post("/appointments").send({}).expect(403)
    })
})

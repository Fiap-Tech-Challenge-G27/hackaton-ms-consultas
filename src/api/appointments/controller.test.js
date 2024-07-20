import request from "../../utils/tests/custom_request"
import {
    appointment_1,
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

describe("PATCH /approval-status", () => {
    it("Unauthorized to patient", async () => {
        await request(patient_1)
            .patch("/appointments/approval-status")
            .send({})
            .expect(403)
    })

    const testChangeValue = (toValue) => {
        return async () => {
            const appointmentDTO = transformAppointmentToDTO(appointment_1)

            const { _id } = await appointmentSchema.create(appointmentDTO)

            await request(appointment_1.doctor)
                .patch(`/appointments/${_id}/approval-status`)
                .send({
                    approvalStatus: toValue,
                })
                .expect(200)

            const { approvalStatus } = await appointmentSchema.findById(_id)
            expect(approvalStatus).toBe(toValue)
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

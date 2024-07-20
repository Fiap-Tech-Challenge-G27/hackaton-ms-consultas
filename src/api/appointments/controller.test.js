import mongoose from "mongoose"
import { copyDocumentWithout } from "../../utils/general.js"
import { generateMeetLink } from "../../utils/meets/meetGenerator.js"
import request from "../../utils/tests/custom_request"
import {
    appointment_1,
    appointment_2,
    transformAppointmentToDTO,
} from "../../utils/tests/objectMothers/appointmentsMother.js"
import {
    doctor_1,
    doctor_2,
} from "../../utils/tests/objectMothers/doctorsMother"
import { patient_1 } from "../../utils/tests/objectMothers/patientsMother"
import appointmentSchema from "./model.js"

const GOOGLE_MEAT_URL_PATTERN = /https:\/\/meet\.google\.com\/\w{3}-\w{4}-\w{3}/

describe("GET /", () => {
    let appointment_dto_1

    beforeEach(async () => {
        appointment_dto_1 = await appointmentSchema.create({
            ...transformAppointmentToDTO(appointment_1),
            meetUrl: generateMeetLink(),
        })
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
            .expect(403, { message: "Unauthorized to patient" })
    })

    const testChangeValue = (value) => {
        return async () => {
            const appointmentDTO = transformAppointmentToDTO(appointment_1)

            const createdAppointment = await appointmentSchema.create(appointmentDTO)

            let expectedBody = copyDocumentWithout(createdAppointment._doc, "__v")
            expectedBody["approvalStatus"] = value
            expectedBody["appointmentStart"] = expectedBody["appointmentStart"].toISOString()
            expectedBody["_id"] = expectedBody["_id"].toString()

            await request(appointment_1.doctor)
                .patch(`/appointments/${createdAppointment._id}/approval-status`)
                .send({
                    approvalStatus: value,
                })
                .expect(200, expectedBody)

            const { approvalStatus } = await appointmentSchema.findById(createdAppointment._id)
            expect(approvalStatus).toBe(value)
        }
    }
    it("Doctor can approve", testChangeValue("approved"))

    it("Doctor can reject", testChangeValue("rejected"))

    it("Doctor when don't exists", async () => {
        const id = new mongoose.Types.ObjectId().toString()

        await request(doctor_1)
            .patch(`/appointments/${id}/approval-status`)
            .send({
                approvalStatus: "approved",
            })
            .expect(404, {
                message: `Not found a appointments with id ${id}`,
            })
    })

    it("Doctor try change other doctor appointment then 404", async () => {
        const appointmentDTO = transformAppointmentToDTO(appointment_1)

        const { _id } = await appointmentSchema.create(appointmentDTO)

        await request(doctor_2)
            .patch(`/appointments/${_id}/approval-status`)
            .send({
                approvalStatus: "approved",
            })
            .expect(404, {
                message: `Not found a appointments with id ${_id}`,
            })

        const { approvalStatus } = await appointmentSchema.findById(_id)
        expect(approvalStatus).toBe("pending")
    })
})

describe("POST /", () => {
    async function expectHasMeetUrl(appointmentDTO) {
        const document = await appointmentSchema.findOne(appointmentDTO)

        expect(GOOGLE_MEAT_URL_PATTERN.test(document["meetUrl"])).toBe(true)
    }
    it("Authorized to patient", async () => {
        const appointmentDTO = transformAppointmentToDTO(appointment_1)

        await request(appointment_1.patient)
            .post("/appointments")
            .send(copyDocumentWithout(appointmentDTO, "patientCPF"))
            .expect(200)

        await expect(appointmentSchema).hasOneDocumentWith(appointmentDTO)
        await expectHasMeetUrl(appointmentDTO)
    })
    it("Unauthorized to doctor", async () => {
        await request(doctor_1).post("/appointments").send({}).expect(403)
    })
})

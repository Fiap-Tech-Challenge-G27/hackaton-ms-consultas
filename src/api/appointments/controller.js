import appointmentSchema from "./model.js"
import { generateMeetLink } from "../../utils/meets/meetGenerator.js"

const queryPropertyMap = {
    crm: "doctorCRM",
    cpf: "patientCPF",
}
const queryFind = (user) => {
    for (const [requestProperty, queryProperty] of Object.entries(
        queryPropertyMap
    )) {
        if (user.hasOwnProperty(requestProperty)) {
            return {
                [queryProperty]: user[requestProperty],
            }
        }
    }

    throw Error("Didn't find 'cpf' or 'crn")
}
export const getAppointment = async (req, res) => {
    const result = await appointmentSchema.find(queryFind(res.locals.user), {
        __v: false,
    })
    return res.json(result)
}

export const postAppointment = async (req, res) => {
    const { doctorCRM, appointmentStart } = req.body
    const { cpf } = res.locals.user

    await appointmentSchema.create({
        doctorCRM: doctorCRM,
        patientCPF: cpf,
        appointmentStart: appointmentStart,
        meetUrl: generateMeetLink(),
    })

    return res.status(200).json({ message: "Server healthy" })
}

export const patchAppointmentApprovalStatus = async (req, res) => {
    const { id } = req.params
    const { approvalStatus } = req.body

    await appointmentSchema.updateOne({ _id: id }, { approvalStatus })

    return res.status(200).json({ message: "Server healthy" })
}

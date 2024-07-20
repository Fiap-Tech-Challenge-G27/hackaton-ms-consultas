import { copyDocumentWithout } from "../../utils/general.js"
import { generateMeetLink } from "../../utils/meets/meetGenerator.js"
import appointmentSchema from "./model.js"
const queryPropertyMap = {
    crm: "doctorCRM",
    cpf: "patientCPF",
}
const createQueryUserFilter = (user) => {
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
    const result = await appointmentSchema.find(createQueryUserFilter(res.locals.user), {
        __v: false,
    })
    return res.json(result)
}

export const postAppointment = async (req, res) => {
    const { doctorCRM, appointmentStart } = req.body
    const { cpf } = res.locals.user

    const result = await appointmentSchema.create({
        doctorCRM: doctorCRM,
        patientCPF: cpf,
        appointmentStart: appointmentStart,
        meetUrl: generateMeetLink(),
    })

    return res.status(200).json(copyDocumentWithout(result._doc, "__v"))
}

export const patchAppointmentApprovalStatus = async (req, res) => {
    const { id } = req.params
    const { approvalStatus } = req.body

    const result = await appointmentSchema.updateOne(
        { _id: id, ...createQueryUserFilter(res.locals.user) },
        { approvalStatus }
    )

    if (result["matchedCount"] == 0) {
        return res.status(404).json({
            message: `Not found a appointments with id ${id}`,
        })
    }

    return res.status(200).json({})
}

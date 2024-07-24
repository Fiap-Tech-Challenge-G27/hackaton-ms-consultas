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

    /* istanbul ignore next */
    throw Error("Didn't find 'cpf' or 'crn'")
}
export const getAppointment = async (req, res) => {
    const result = await appointmentSchema.find(
        createQueryUserFilter(res.locals.user),
        {
            __v: false,
        }
    )
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

    const queryFilter = { _id: id, ...createQueryUserFilter(res.locals.user) }

    const result = await appointmentSchema.updateOne(queryFilter, {
        approvalStatus,
    })

    if (result["matchedCount"] == 0) {
        return res.status(404).json({
            message: `Not found a appointments with id ${id}`,
        })
    }

    const updatedDocument = await appointmentSchema.findOne(queryFilter, {
        __v: false,
    })
    return res.status(200).json(updatedDocument)
}

export const patchAppointmentCPF = async (req, res) => {
    const oldCPF = res.locals.user.cpf
    const newCPF = req.body.cpf

    await appointmentSchema.updateMany(
        {
            patientCPF: oldCPF,
        },
        {
            patientCPF: newCPF,
        }
    )

    return res.status(200).json({})
}

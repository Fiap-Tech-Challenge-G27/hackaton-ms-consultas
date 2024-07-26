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

const uniquePatchReturn = async (res, updateOneResponse, id) => {
    if (updateOneResponse["matchedCount"] == 0) {
        return res.status(404).json({
            message: `Not found a appointments with id ${id}`,
        })
    }

    const updatedDocument = await appointmentSchema.findById(id, {
        __v: false,
    })
    return res.status(200).json(updatedDocument)
}

export const patchAppointmentApprovalStatus = async (req, res) => {
    const { id } = req.params
    const { approvalStatus } = req.body

    const queryFilter = { _id: id, ...createQueryUserFilter(res.locals.user) }

    const result = await appointmentSchema.updateOne(queryFilter, {
        approvalStatus,
    })

    return await uniquePatchReturn(res, result, id)
}

export const patchAppointmentCPF = async (req, res) => {
    await appointmentSchema.updateMany(
        {
            patientCPF: res.locals.user.cpf,
        },
        {
            patientCPF: req.body.cpf || null,
        }
    )

    return res.status(200).json({})
}

export const patchAppointmentCRN = async (req, res) => {
    await appointmentSchema.updateMany(
        {
            doctorCRM: res.locals.user.crm,
        },
        {
            doctorCRM: req.body.crm || null,
        }
    )

    return res.status(200).json({})
}

export const patchAppointmentCancellation = async (req, res) => {
    const { id } = req.params
    const { cancellation, cancellationJustification } = req.body

    const queryFilter = { _id: id, ...createQueryUserFilter(res.locals.user) }

    const result = await appointmentSchema.updateOne(queryFilter, {
        cancellation,
        cancellationJustification,
    })

    return await uniquePatchReturn(res, result, id)
}

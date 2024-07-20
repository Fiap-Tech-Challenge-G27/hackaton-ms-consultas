import appointmentSchema from "./model.js"

export const postAppointment = async (req, res) => {
    const { doctorCRM, appointmentStart } = req.body
    const { cpf } = res.locals.user

    await appointmentSchema.create({
        doctorCRM: doctorCRM,
        patientCPF: cpf,
        appointmentStart: appointmentStart,
    })

    return res.status(200).json({ message: "Server healthy" })
}

export const patchAppointmentApprovalStatus = async (req, res) => {
    const { id } = req.params
    const { approvalStatus } = req.body

    console.log(approvalStatus)

    await appointmentSchema.updateOne({ _id: id }, { approvalStatus })

    return res.status(200).json({ message: "Server healthy" })
}

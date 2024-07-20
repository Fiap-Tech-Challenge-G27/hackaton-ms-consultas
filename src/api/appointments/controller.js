

export const postAppointment = (req, res) => {
    console.log(req.body)
    console.log("=====================")
    return res.status(200).json({ message: "Server healthy" })
}

export const patchAppointmentApprovalStatus = (req, res) => {
    return res.status(200).json({ message: "Server healthy" })
}

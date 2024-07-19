import mongoose from "mongoose"
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
    doctorCRM: {
        type: String,
    },
    patientCPF: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "user",
    },
})

const model = mongoose.model("Appointment", appointmentSchema)

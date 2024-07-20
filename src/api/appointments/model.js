import mongoose from "mongoose"
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
    doctorCRM: {
        type: String,
    },
    patientCPF: {
        type: String,
    },
    appointmentStart: {
        type: Date,
    },
    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    meetUrl: {
        type: String
    }
})

const model = mongoose.model("Appointment", appointmentSchema)

export const schema = model.schema
export default model

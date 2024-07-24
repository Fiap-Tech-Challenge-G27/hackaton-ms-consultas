import { copyDocumentWithout } from "../../general.js"
import { doctor_1, doctor_2 } from "./doctorsMother"
import { patient_1, patient_2 } from "./patientsMother"

export const transformAppointmentToDTO = (appointment) => {
    return {
        doctorCRM: appointment.doctor.crm,
        appointmentStart: appointment.appointmentStart,
        patientCPF: appointment.patient.cpf,
    }
}

export const transformAppointmentToView = (appointment) => {
    let result = copyDocumentWithout(appointment, "__v")
    result["appointmentStart"] = result["appointmentStart"].toISOString()
    result["_id"] = result["_id"].toString()

    return result
}

export const appointment_1 = {
    doctor: doctor_1,
    patient: patient_1,
    appointmentStart: "2015-03-25T12:00:00.000Z",
}

export const appointment_2 = {
    doctor: doctor_2,
    patient: patient_2,
    appointmentStart: "2015-03-26T12:00:00.000Z",
}

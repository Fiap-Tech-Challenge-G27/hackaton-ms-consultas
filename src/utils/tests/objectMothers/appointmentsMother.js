import { doctor_1 } from "./doctorsMother"
import { patient_1 } from "./patientsMother"

export const transformAppointmentToDTO = (appointment) => {
    return {
        doctorCRM: appointment.doctor.crm,
        appointmentStart: appointment.appointmentStart,
        patientCPF: appointment.patient.cpf,
    }
}

export const appointment_1 = {
    doctor: doctor_1,
    patient: patient_1,
    appointmentStart: "2015-03-25T12:00:00.000Z",
}

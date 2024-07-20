import { signIn } from "../src/utils/tests/auth.js"
import { doctor_1 } from "../src/utils/tests/objectMothers/doctorsMother.js"
import { patient_1 } from "../src/utils/tests/objectMothers/patientsMother.js"

console.log("patient", signIn(patient_1))
console.log("doctor", signIn(doctor_1))

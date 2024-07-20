import { Router } from "express"
import { body } from "express-validator"
import { authenticate } from "../../utils/jwt/index.js"
import { validate } from "../../utils/tests/validation.js"
import {
    patchAppointmentApprovalStatus,
    postAppointment,
} from "./controller.js"
const router = Router()

router.post(
    "",
    authenticate({ roles: ["patient"] }),
    body("doctorCRM").isString(),
    body("appointmentStart").isISO8601().toDate(),
    validate,
    postAppointment
)
router.patch(
    "/:id/approval-status",
    authenticate({ roles: ["doctor"] }),
    patchAppointmentApprovalStatus
)

export default router

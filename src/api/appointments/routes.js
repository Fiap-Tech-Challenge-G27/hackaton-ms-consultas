import { Router } from "express"
import { body, param } from "express-validator"
import { authenticate } from "../../utils/jwt/index.js"
import { validate } from "../../utils/tests/validation.js"
import {
    getAppointment,
    patchAppointmentApprovalStatus,
    postAppointment,
} from "./controller.js"
const router = Router()

router.get("", authenticate({ roles: ["patient", "doctor"] }), getAppointment)

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
    body("approvalStatus").isString().isIn(['approved', 'rejected']),
    param("id").isString(),
    validate,
    patchAppointmentApprovalStatus
)

export default router

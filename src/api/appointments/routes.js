import { Router } from "express"
import { body, validationResult } from "express-validator"
import { authenticate } from "../../utils/jwt"
import { validate } from "../../utils/tests/validation"
import { patchAppointmentApprovalStatus, postAppointment } from "./controller"
const router = Router()

router.post(
    "",
    authenticate({ roles: ["patient"] }),
    body("doctorCRM").notEmpty(),
    validate,
    postAppointment
)
router.patch(
    "/approval-status",
    authenticate({ roles: ["doctor"] }),
    patchAppointmentApprovalStatus
)

export default router

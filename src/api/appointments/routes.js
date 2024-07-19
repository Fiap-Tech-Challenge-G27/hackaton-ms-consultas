import { Router } from "express"
import { authenticate } from "../../utils/jwt"
import { patchAppointmentApprovalStatus, postAppointment } from "./controller"

const router = Router()

router.post("", authenticate({ roles: ["patient"] }), postAppointment)
router.patch(
    "/approval-status",
    authenticate({ roles: ["doctor"] }),
    patchAppointmentApprovalStatus
)

export default router

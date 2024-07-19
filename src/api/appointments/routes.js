import { Router } from 'express';
import { verify } from "../../utils/jwt";
import { patchAppointmentApprovalStatus, postAppointment } from "./controller";

const router = Router();

router.post('', verify({ roles: ['patient'] }), postAppointment);
router.patch('/approval-status', verify({ roles: ['doctor'] }), patchAppointmentApprovalStatus);

export default router;
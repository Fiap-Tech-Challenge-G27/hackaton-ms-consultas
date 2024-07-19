import { Router } from "express"
import health from "./health/routes.js"
import appointments from "./appointments/routes.js"

const router = Router()

router.use("/health", health)
router.use("/appointments", appointments)

export default router

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of appointment
 *         doctorCRM:
 *           type: string
 *           description: The doctor CRM
 *         patientCPF:
 *           type: string
 *           description: The patient CPF
 *         appointmentStart:
 *            type: string
 *            format: date-time
 *            description: The Date of start of appointment
 *         approvalStatus:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: status of approval
 *         meetUrl:
 *           type: string
 *           description: Google Meet URL
 *       example:
 *         id: 669bf86d740be2f57eebff63
 *         doctorCRM: 29278-MG
 *         patientCPF: 48252687733
 *         appointmentStart: 2015-03-25T12:00:00.000Z
 *         approvalStatus: pending
 *         meetUrl: https://meet.google.com/bwe-mzoz-bfj
 * tags:
 *    name: Appointments
 *    description: The appointments managing API
 */

import { Router } from "express"
import { body, param } from "express-validator"
import { authenticate } from "../../utils/jwt/index.js"
import { validate } from "../../utils/tests/validation.js"
import {
    getAppointment,
    patchAppointmentApprovalStatus,
    postAppointment,
} from "./controller.js"

const MONGO_OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/

const router = Router()

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Lists all appointments that involves the user
 *     tags: [Appointments]
 *     responses: 
 *       200:
 *         description: the list of the appointments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
*/
router.get("", authenticate({ roles: ["patient", "doctor"] }), getAppointment)

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Creates a appointments that involves the user
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                doctorCRM:
 *                  type: string
 *                  description: The doctor CRM
 *                appointmentStart:
 *                  type: string
 *                  format: date-time
 *                  description: The Date of start of appointment
 *              example:
 *                doctorCRM: 29278-MG
 *                appointmentStart: 2015-03-25T12:00:00.000Z
 *     responses:
 *       200:
 *         description:  the created of the appointments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
*/
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
    body("approvalStatus").isString().isIn(["approved", "rejected"]),
    param("id").isString().matches(MONGO_OBJECT_ID_PATTERN),
    validate,
    patchAppointmentApprovalStatus
)

export default router

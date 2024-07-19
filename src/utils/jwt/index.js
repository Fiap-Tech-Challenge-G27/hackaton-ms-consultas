import jwt from "jsonwebtoken";
import config from '../../config';

const { jwtSecret } = config;

export const signAsDoctor = (crm, options) => jwt.sign({ crm }, jwtSecret, options)
export const signAsPatient = (cpf, options) => jwt.sign({ cpf }, jwtSecret, options)

const extractToken = (req) => {
    const [type, token] = req.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
}

export const verify = ({ roles }) => {
    return (req, res, next) => {
        const token = extractToken(req)

        if (token == null) return res.sendStatus(401)

        try {
            var decoded = jwt.verify(token, jwtSecret)
        } catch (err) {
            return res.status(401).json({ 'message': 'Unauthenticated' })
        }

        if (decoded.hasOwnProperty('crm')) {
            if (!roles.includes("doctor")) {
                return res.status(403).json({ 'message': 'Unauthorized to doctor' })
            }
            return next()
        }

        if (decoded.hasOwnProperty('cpf')) {
            if (!roles.includes("patient")) {
                return res.status(403).json({ 'message': 'Unauthorized to patient' })
            }
            return next()
        }

        return res.status(403).json({ 'message': 'Invalid Role' })
    }
}

import jwt from "jsonwebtoken"
import config from "../../config.js"

const { jwtSecret } = config

const extractToken = (req) => {
    const [type, token] = req.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
}

const rolePropertyMap = {
    doctor: "crm",
    patient: "cpf",
}

export const authenticate = ({ roles }) => {
    return (req, res, next) => {
        const token = extractToken(req)

        try {
            var decoded = jwt.verify(token, jwtSecret)
        } catch (err) {
            return res.status(401).json({ message: "Unauthenticated" })
        }

        for (const [role, property] of Object.entries(rolePropertyMap)) {
            if (decoded.hasOwnProperty(property)) {
                if (!roles.includes(role)) {
                    return res
                        .status(403)
                        .json({ message: `Unauthorized to ${role}` })
                }
                res.locals.user = decoded
                return next()
            }
        }

        return res.status(403).json({ message: "Invalid Role" })
    }
}

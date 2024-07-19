import jwt from "jsonwebtoken"
import config from "../../config"

const { jwtSecret } = config

export const signIn = (userObject, options) =>
    jwt.sign(userObject, jwtSecret, options)

export const signAsDoctor = (crm, options) => signIn({ crm }, options)
export const signAsPatient = (cpf, options) => signIn({ cpf }, options)

import jwt from "jsonwebtoken"
import config from "../../config"

const { jwtSecret } = config

export const signIn = (userObject, options) =>
    jwt.sign(userObject, jwtSecret, options)

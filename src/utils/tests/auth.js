import jwt from "jsonwebtoken"
import config from "../../config.js"

const { jwtSecret } = config

export const signIn = (userObject, options) =>
    jwt.sign(userObject, jwtSecret, options)

import supertest from "supertest"
import { signIn } from "./auth"
import app from "../../app"

export default (userObject) => {
    const token = signIn(userObject)

    return supertest.agent(app).set({ authorization: `Bearer ${token}` })
}

import { jest } from "@jest/globals"
import { authenticate } from "."
import { signIn } from "../../utils/tests/auth"
import { doctor_1 } from "../../utils/tests/objectMothers/doctorsMother"
import { patient_1 } from "../../utils/tests/objectMothers/patientsMother"

function mockReq(token) {
    const headers = token
        ? {
              authorization: `Bearer ${token}`,
          }
        : {}

    return {
        headers,
    }
}

function mockRes() {
    const jsonMock = jest.fn()
    const statusMock = jest.fn().mockReturnValue({
        json: jsonMock,
    })
    const res = {
        status: statusMock,
    }

    return { jsonMock, statusMock, res }
}

const testUnsuccessfully = ({ token, roles, expectedStatus, message }) => {
    return async () => {
        const req = mockReq(token)
        const { jsonMock, statusMock, res } = mockRes()
        const next = jest.fn()

        authenticate({ roles })(req, res, next)

        expect(statusMock).haveBeenCalledOnceWith(expectedStatus)
        expect(jsonMock).haveBeenCalledOnceWith({
            message,
        })
    }
}

describe("JWT Verify", () => {
    it(
        "Without Token then Unauthenticated",
        testUnsuccessfully({
            token: null,
            roles: [],
            expectedStatus: 401,
            message: "Unauthenticated",
        })
    )

    it(
        "Invalid Token then Unauthenticated",
        testUnsuccessfully({
            token: "invalid token",
            roles: [],
            expectedStatus: 401,
            message: "Unauthenticated",
        })
    )

    it(
        "Valid token when Doctor but need be Patient",
        testUnsuccessfully({
            token: signIn(doctor_1),
            roles: ["patient"],
            expectedStatus: 403,
            message: "Unauthorized",
        })
    )

    it(
        "Valid token when Patient but need be Doctor",
        testUnsuccessfully({
            token: signIn(patient_1),
            roles: ["doctor"],
            expectedStatus: 403,
            message: "Unauthorized",
        })
    )

    it(
        "Valid token invalid role",
        testUnsuccessfully({
            token: signIn({ invalid: "invalid" }),
            roles: ["doctor"],
            expectedStatus: 403,
            message: "Invalid Role",
        })
    )

    it("Success", async () => {
        const req = mockReq(signIn(patient_1))
        const { res } = mockRes()
        const next = jest.fn()

        authenticate({ roles: ["patient"] })(req, res, next)

        expect(next).haveBeenCalledOnceWith()
    })
})

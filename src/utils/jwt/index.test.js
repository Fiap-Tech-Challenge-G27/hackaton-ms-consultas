import { jest } from "@jest/globals"
import { verify } from "."
import { signAsDoctor, signAsPatient } from "../../utils/tests/auth"

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

        verify({ roles })(req, res, next)

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
            token: signAsDoctor("crm"),
            roles: ["patient"],
            expectedStatus: 403,
            message: "Unauthorized",
        })
    )
})

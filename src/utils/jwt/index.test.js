import { jest } from "@jest/globals"
import { verify } from "."

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

const testUnsuccessfully = (token, expectedStatus, message) => {
    return async () => {
        const req = mockReq(token)
        const { jsonMock, statusMock, res } = mockRes()
        const next = jest.fn()

        verify([])(req, res, next)

        expect(statusMock).haveBeenCalledOnceWith(expectedStatus)
        expect(jsonMock).haveBeenCalledOnceWith({
            message,
        })
    }
}

describe("JWT Verify", () => {
    it(
        "Without Token then Unauthenticated",
        testUnsuccessfully(null, 401, "Unauthenticated")
    )

    it("Invalid Token then Unauthenticated", testUnsuccessfully("invalid token", 401, "Unauthenticated"))
})

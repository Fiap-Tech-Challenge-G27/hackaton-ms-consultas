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

describe("JWT Verify", () => {
    it("Without Token then Unauthenticated", async () => {
        const req = mockReq()
        const { jsonMock, statusMock, res } = mockRes()
        const next = jest.fn()

        verify([])(req, res, next)

        expect(statusMock).haveBeenCalledOnceWith(401)
        expect(jsonMock).haveBeenCalledOnceWith({
            message: "Unauthenticated",
        })
    })

    it("Invalid Token then Unauthenticated", async () => {
        const req = mockReq("invalid token")
        const { jsonMock, statusMock, res } = mockRes()
        const next = jest.fn()

        verify([])(req, res, next)

        expect(statusMock).haveBeenCalledOnceWith(401)
        expect(jsonMock).haveBeenCalledOnceWith({
            message: "Unauthenticated",
        })
    })
})

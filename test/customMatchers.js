export function haveBeenCalledOnceWith(mockFunc, ...expectedArgs) {
    const calls = mockFunc.mock.calls
    if (calls.length !== 1) {
        return {
            message: () =>
                `expected calls number be exactly 1, not ${calls.length()}`,
            pass: false,
        }
    }

    const actualArgs = calls[0]

    if (actualArgs.length !== expectedArgs.length) {
        return {
            message: () =>
                `expected number of parameters of actual and expect be equal, as actual: ${actualArgs.length} and expected: ${expectedArgs.length}`,
            pass: false,
        }
    }

    for (let i = 0; i < actualArgs.length; i++) {
        if (actualArgs[i].toString() != expectedArgs[i].toString()) {
            return {
                message: () =>
                    `expected parameters be equals, but the ${
                        i + 1
                    } parameters is different, ${actualArgs[i]} != ${
                        expectedArgs[i]
                    }`,
                pass: false,
            }
        }
    }
    return {
        message: () => "have been called once with expected parameters",
        pass: true,
    }
}

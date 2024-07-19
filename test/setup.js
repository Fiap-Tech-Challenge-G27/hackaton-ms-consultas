import { jest } from "@jest/globals"
import { MongoMemoryServer } from "mongodb-memory-server"
import { haveBeenCalledOnceWith } from "./customMatchers"
import mongoose from "mongoose"

jest.setTimeout(10000)

global.Array = Array
global.Date = Date
global.Function = Function
global.Math = Math
global.Number = Number
global.Object = Object
global.RegExp = RegExp
global.String = String
global.Uint8Array = Uint8Array
global.WeakMap = WeakMap
global.Set = Set
global.Error = Error
global.TypeError = TypeError
global.parseInt = parseInt
global.parseFloat = parseFloat

let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    mongoose.connect(mongoUri)

    expect.extend({
        haveBeenCalledOnceWith,
    })
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

afterEach(async () => {
    const { collections } = mongoose.connection
    const promises = Object.values(collections).map((collection) =>
        collection.deleteMany()
    )

    await Promise.all(promises)
})

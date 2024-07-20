import mongoose from "mongoose"
import app from "./app.js"
import config from "./config.js"

const { port, mongo } = config

if (mongo.uri) mongoose.connect(mongo.uri)

app.listen(port, (error) => {
    if (!error)
        console.log(
            "Server is Successfully Running, and App is listening on port " +
                port
        )
    else console.log("Error occurred, server can't start", error)
})

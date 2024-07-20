import express from "express"
import api from "./api/index.js"

const app = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded())
app.use((err, req, res, next) => {
    console.log(err)
})
app.use(api)

export default app

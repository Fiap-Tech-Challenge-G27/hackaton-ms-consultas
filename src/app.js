import express, { json } from "express";
import api from "./api/index.js";

const app = express()

app.use(api)
app.use(json())

app.use((err, req, res, next) => {
    console.log(err)
})

export default app

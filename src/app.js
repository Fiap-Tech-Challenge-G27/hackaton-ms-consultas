import express from "express"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import api from "./api/index.js"

const app = express()

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "MS-Consultas",
            version: "0.1.0",
            description: "A microservice to appointments management",
            license: {
                name: "ISC",
                url: "https://opensource.org/license/isc-license-txt",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/api/*/routes.js"],
}

const specs = swaggerJsdoc(options)
app.use(
    "/appointments/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs),
    swaggerUi.setup(specs, { explorer: true })
)

app.use(express.json())
app.use(express.text())
app.use((err, req, res, next) => {
    console.log(err)
})
app.use(api)

export default app

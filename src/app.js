const express = require('express');
const api = require("./api")
require('dotenv/config');



const app = express();
const PORT = process.env.PORT;

app.use("", api)
app.use(express.json());

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);
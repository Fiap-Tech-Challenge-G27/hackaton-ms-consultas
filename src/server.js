import app from "./app.js";

import config from './config.js'

const { port } = config;

app.listen(port, (error) => {
    if (!error)
        console.log(
            "Server is Successfully Running, and App is listening on port " + port
        );
    else console.log("Error occurred, server can't start", error);
});

import "dotenv/config"

const requireProcessEnv = (name) => {
    if (!process.env[name]) {
        throw new Error("You must set the " + name + " environment variable")
    }
    return process.env[name]
}

export default {
    port: process.env.PORT || 8080,
    jwtSecret: requireProcessEnv("JWT_SECRET"),
    mongo: {
        uri: requireProcessEnv("MONGODB_URI"),
        options: {
            debug: false,
        },
    },
}

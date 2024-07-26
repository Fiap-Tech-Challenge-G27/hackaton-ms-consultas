import "dotenv/config"

const requireProcessEnv = (name) => {
    if (!process.env[name] && process.env.NODE_ENV !== "test") {
        throw new Error("You must set the " + name + " environment variable")
    }
    return process.env[name]
}

const config = {
    all: {
        env: process.env.NODE_ENV || "development",
        port: process.env.PORT || 8080,
        jwtSecret: requireProcessEnv("JWT_SECRET"),
        mongo: {
            uri: requireProcessEnv("MONGODB_URI"),
            options: {
                debug: false,
            },
        },
    },
    test: {
        jwtSecret: "jwt secret for tests",
    },
}
export default { ...config.all, ...config[config.all.env] }

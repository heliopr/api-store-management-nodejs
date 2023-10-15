require("dotenv").config()
const express = require("express")
const fs = require("fs")
const database = require("./database")

const app = express()
let httpServer

function registerRoutes(path) {
    fs.readdirSync("./src/routes" + path).forEach(f => {
        full = "./src/routes" + path + f
        if (fs.lstatSync(full).isDirectory()) {
            registerRoutes(path + f + "/")
        }
        else {
            const router = require("./routes" + path + f)
            app.use("/", router)
        }
    })
}

async function exit(server) {
    console.log("\nClosing http server")
    await httpServer.close()
    console.log("Http server closed")
    await database.close()
    console.log("Exiting...")
    process.exit(0)
}


(async () => {
    if (!await database.connect()) return
    if (!await database.setupTables()) return

    registerRoutes("/")

    httpServer = app.listen(process.env.PORT, () => {
        console.log("Listening to port " + process.env.PORT)
    })

    process.on("SIGINT", exit)
    process.on("SIGTERM", exit)
})()
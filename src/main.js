require("dotenv").config()
const express = require("express")
const fs = require("fs")
const database = require("./database")
const productManager = require("./managers/productManager")

const app = express()
let httpServer

function useRoutes(path) {
    fs.readdirSync("./src/routes" + path).forEach(f => {
        full = "./src/routes" + path + f
        if (fs.lstatSync(full).isDirectory()) {
            useRoutes(path + f + "/")
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

    useRoutes("/")

    httpServer = app.listen(process.env.PORT, () => {
        console.log("Listening to port " + process.env.PORT)
    })

    process.on("SIGINT", exit)
    process.on("SIGTERM", exit)

    await productManager.insertProduct("coca", 15, 10)
    console.log(await productManager.countAllProducts())

    /*console.log(await productManager.getProductBy("name", "coca"))
    console.log(await productManager.getProductBy("name", "cocac"))*/
})()
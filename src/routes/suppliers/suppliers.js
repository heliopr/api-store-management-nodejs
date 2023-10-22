const bodyParser = require("body-parser")
const { Router } = require("express")
const supplierManager = require("../../managers/supplierManager")

const router = Router()

router.get("/suppliers", async (req, res) => {
    try {
        const [result, error] = await supplierManager.getAllSuppliers()
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json(result || [])
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})



router.get("/suppliers/count", async (req, res) => {
    try {
        const [count, error] = await supplierManager.countAllSuppliers()

        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json({ count: Number(count) })
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})



router.get("/suppliers/:id", async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }

        const [supplier, error] = await supplierManager.getSupplierById(id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json(supplier || {})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})



router.post("/suppliers", bodyParser.json(), async (req, res) => {
    try {
        const name = req.body["name"]

        if (name == undefined || name == null || name.length < 1) {
            return res.status(400).json({ message: "Invalid field 'name'" })
        }


        {
            const [supplier, error] = await supplierManager.getSupplierByName(name)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (supplier != null && supplier != undefined) {
                return res.status(400).json({ message: "Name is already in use" })
            }
        }


        const [supplier, error] = await supplierManager.createSupplier(name)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json(supplier || {})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})



router.delete("/suppliers/:id", async (req, res) => {
    try {
        const id = parseInt(req.params["id"])

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }


        {
            const [supplier, error] = await supplierManager.getSupplierById(id)
            if (error) {
                return res.status(400).json({ message: "An error occcurred in the database" })
            }
            else if (supplier == null || supplier == undefined) {
                return res.status(400).json({ message: "Supplier not found" })
            }
        }


        const [result, error] = await supplierManager.deleteSupplier(id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json({ message: "Supplier deleted" })
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})



router.put("/suppliers/:id", bodyParser.json(), async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        const name = req.body["name"]

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }

        if (name == undefined || name.length < 1) {
            return res.status(400).json({ message: "Invalid field 'name'" })
        }


        {
            const [supplier, error] = await supplierManager.getSupplierById(id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (supplier == null || supplier == undefined) {
                return res.status(400).json({ message: "Supplier not found" })
            }
        }


        {
            const [supplier, error] = await supplierManager.getSupplierByName(name)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (supplier != null && supplier != undefined && supplier.id != id) {
                return res.status(400).json({ message: "Name is already in use" })
            }
        }



        const [result, error] = await supplierManager.setName(id, name)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json({id: id, name: name})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})

module.exports = router
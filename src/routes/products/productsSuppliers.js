const bodyParser = require("body-parser")
const { Router } = require("express")
const productManager = require("../../managers/productManager")
const supplierManager = require("../../managers/supplierManager")

const router = Router()

router.get("/products/:id/suppliers", async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }

        {
            const [product, error] = await productManager.getProductById(id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (product == null || product == undefined) {
                return res.status(400).json({ message: "Product not found" })
            }
        }


        const [result, error] = await productManager.getSuppliers(id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        const suppliers = []

        for (const supplier of result) {
            suppliers.push(supplier.supplier_id)
        }

        res.status(200).json(suppliers)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})


router.post("/products/:id/suppliers", bodyParser.json(), async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        const supplierId = parseInt(req.body["supplier_id"])
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }

        if (isNaN(supplierId)) {
            return res.status(400).json({ message: "Invalid field 'supplier_id'" })
        }

        {
            const [product, error] = await productManager.getProductById(id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (product == null || product == undefined) {
                return res.status(400).json({ message: "Product not found" })
            }
        }

        {
            const [supplier, error] = await supplierManager.getSupplierById(supplierId)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (supplier == null || supplier == undefined) {
                return res.status(400).json({ message: "Supplier not found" })
            }
        }

        {
            const [hasSupplier, error] = await productManager.hasSupplier(id, supplierId)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (hasSupplier) {
                return res.status(400).json({ message: "Product already has this supplier" })
            }
        }


        const [result, error] = await productManager.addSupplier(id, supplierId)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json({ message: "Success" })
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})


router.delete("/products/:id/suppliers/:supplierId", async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        const supplierId = parseInt(req.params["supplierId"])

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }

        if (isNaN(supplierId)) {
            return res.status(400).json({ message: "Invalid parameter 'supplierId'" })
        }


        {
            const [product, error] = await productManager.getProductById(id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (product == null || product == undefined) {
                return res.status(400).json({ message: "Product not found" })
            }
        }


        {
            const [hasSupplier, error] = await productManager.hasSupplier(id, supplierId)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (!hasSupplier) {
                return res.status(400).json({ message: "Supplier not found" })
            }
        }

        const [result, error] = await productManager.removeSupplier(id, supplierId)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json({ message: "Success" })
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})

module.exports = router
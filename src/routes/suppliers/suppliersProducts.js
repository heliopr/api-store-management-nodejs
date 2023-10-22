const bodyParser = require("body-parser")
const { Router } = require("express")
const supplierManager = require("../../managers/supplierManager")
const productManager = require("../../managers/productManager")

const router = Router()

router.get("/suppliers/:id/products", async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
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


        const [result, error] = await supplierManager.getProducts(id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        const products = []

        for (const product of result) {
            products.push(product.product_id)
        }

        res.status(200).json(products)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})


router.post("/suppliers/:id/products", bodyParser.json(), async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        const productId = parseInt(req.body["product_id"])
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }

        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid field 'product_id'" })
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
            const [product, error] = await productManager.getProductById(productId)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (product == null || product == undefined) {
                return res.status(400).json({ message: "Product not found" })
            }
        }

        {
            const [hasSupplier, error] = await productManager.hasSupplier(productId, id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (hasSupplier) {
                return res.status(400).json({ message: "Product already has this supplier" })
            }
        }


        const [result, error] = await productManager.addSupplier(productId, id)
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


router.delete("/suppliers/:id/products/:productId", async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        const productId = parseInt(req.params["productId"])

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }

        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid parameter 'productId'" })
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
            const [hasSupplier, error] = await productManager.hasSupplier(productId, id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (!hasSupplier) {
                return res.status(400).json({ message: "Product not found" })
            }
        }

        const [result, error] = await productManager.removeSupplier(productId, id)
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
const bodyParser = require("body-parser")
const { Router } = require("express")
const productManager = require("../managers/productManager")
const categoryManager = require("../managers/categoryManager")

const router = Router()

router.get("/products", async (req, res) => {
    try {
        const [result, error] = await productManager.getAllProducts()
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


router.get("/products/:id", async (req, res) => {
    try {
        let id = parseInt(req.params["id"])
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }

        const [product, error] = await productManager.getProductById(id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json(product || {})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})


router.post("/products", bodyParser.json(), async (req, res) => {
    try {
        let { name, price, quantity, category_id } = req.body
        category_id = parseInt(category_id)
        quantity = parseInt(quantity)
        price = parseFloat(price)

        category_id = isNaN(category_id) ? null : category_id
        quantity = isNaN(quantity) ? 0 : quantity

        if (!name || name.length < 1) {
            return res.status(400).json({ message: "Invalid required field 'name'" })
        }

        if (isNaN(price) || price < 0) {
            return res.status(400).json({ message: "Invalid required field 'price'" })
        }

        if (quantity < 0) {
            return res.status(400).json({ message: "Invalid quantity" })
        }


        {
            const [product, error] = await productManager.getProductByName(name)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (product != undefined && product != null) {
                return res.status(400).json({ message: "Name is already in use" })
            }
        }


        const [product, error] = await productManager.createProduct(name, price, quantity, category_id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json(product || {})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})


router.delete("/products/:id", async (req, res) => {
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
            else if (product == undefined || product == null) {
                return res.status(400).json({ message: "Product not found" })
            }
        }

        const [result, error] = await productManager.deleteProduct(id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json({ message: "Product deleted" })
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})


router.put("/products/:id", bodyParser.json(), async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        const name = req.body["name"]
        let { price, quantity, category_id } = req.body
        price = parseFloat(price)
        quantity = parseInt(quantity)
        category_id = parseInt(category_id)

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }

        if (!isNaN(price) && price < 0) {
            return res.status(400).json({ message: "Price must be > 0" })
        }

        if (!isNaN(quantity) && quantity < 0) {
            return res.status(400).json({ message: "Quantity must be > 0" })
        }

        if (name != undefined && name.length < 1) {
            return res.status(400).json({ message: "Name can not be an empty string" })
        }


        const [product, error] = await productManager.getProductById(id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }


        if (!isNaN(category_id)) {
            const [category, error] = await categoryManager.getCategoryById(category_id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (category == null || category == undefined) {
                return res.status(400).json({ message: "Category not found" })
            }
            else {
                product.category_id = category_id
            }
        }

        if (name != undefined && name != product.name) {
            const [p, error] = await productManager.getProductByName(name)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (p != undefined && p != null) {
                return res.status(400).json({ message: "Name is already in use" })
            }
            else {
                product.name = name
            }
        }

        if (!isNaN(price)) {
            product.price = price
        }

        if (!isNaN(quantity)) {
            product.quantity = quantity
        }


        const [result, err] = await productManager.updateProduct(product)
        if (err) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json(product)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})

module.exports = router
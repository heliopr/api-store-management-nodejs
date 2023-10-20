const bodyParser = require("body-parser")
const { Router } = require("express")
const categoryManager = require("../managers/categoryManager")

const router = Router()


router.get("/categories/count", async (req, res) => {
    try {
        const [count, error] = await categoryManager.countAllCategories()
        
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json({count: Number(count)})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})


router.get("/categories", async (req, res) => {
    try {
        const [result, error] = await categoryManager.getAllCategories()
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



router.get("/categories/:id", async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }

        const [category, error] = await categoryManager.getCategoryById(id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json(category || {})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})



router.post("/categories", bodyParser.json(), async (req, res) => {
    try {
        const name = req.body["name"]

        if (name == undefined || name == null || name.length < 1) {
            return res.status(400).json({ message: "Invalid field 'name'" })
        }


        {
            const [category, error] = await categoryManager.getCategoryByName(name)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (category != null && category != undefined) {
                return res.status(400).json({ message: "Name is already in use" })
            }
        }


        const [category, error] = await categoryManager.createCategory(name)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json(category || {})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})



router.delete("/categories/:id", async (req, res) => {
    try {
        const id = parseInt(req.params["id"])

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid parameter 'id'" })
        }


        {
            const [category, error] = await categoryManager.getCategoryById(id)
            if (error) {
                return res.status(400).json({ message: "An error occcurred in the database" })
            }
            else if (category == null || category == undefined) {
                return res.status(400).json({ message: "Category not found" })
            }
        }


        const [result, error] = await categoryManager.deleteCategory(id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json({ message: "Category deleted" })
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})



router.put("/categories/:id", bodyParser.json(), async (req, res) => {
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
            const [category, error] = await categoryManager.getCategoryById(id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (category == null || category == undefined) {
                return res.status(400).json({ message: "Category not found" })
            }
            else if (category.name == name) {
                return res.status(200).json({id: id, name: name})
            }
        }


        {
            const [category, error] = await categoryManager.getCategoryByName(name)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (category != null && category != undefined) {
                return res.status(400).json({ message: "Name is already in use" })
            }
        }



        const [result, error] = await categoryManager.setName(id, name)
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
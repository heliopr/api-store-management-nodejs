const bodyParser = require("body-parser")
const { Router } = require("express")
const supplierManager = require("../../managers/supplierManager")

const router = Router()

router.get("/suppliers/:id/contacts", async (req, res) => {
    try {
        const id = parseInt(req.params["id"])

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid paremeter 'id'" })
        }

        {
            const [supplier, error] = await supplierManager.getSupplierById(id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (supplier == undefined || supplier == null) {
                return res.status(400).json({ message: "Supplier not found" })
            }
        }

        const [contacts, error] = await supplierManager.getContacts(id)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json(contacts || [])
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})


router.post("/suppliers/:id/contacts", bodyParser.json(), async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        const type = req.body["type"]
        const contact = req.body["contact"]

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid paremeter 'id'" })
        }

        if (type !== "email" && type !== "phone_number") {
            return res.status(400).json({ message: "Invalid field 'type' (must be either 'email' or 'phone_number')" })
        }

        if (contact == null || contact.length < 1) {
            return res.status(400).json({ message: "Invalid field 'contact'" })
        }


        {
            const [supplier, error] = await supplierManager.getSupplierById(id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (supplier == undefined || supplier == null) {
                return res.status(400).json({ message: "Supplier not found" })
            }
        }


        {
            const [supplier, error] = await supplierManager.getContactOwner(contact)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (supplier != undefined && supplier != null) {
                return res.status(400).json({ message: "Contact is already being used" })
            }
        }


        const [result, error] = await supplierManager.createContact(id, type, contact)
        if (error) {
            return res.status(400).json({ message: "An error occurred in the database" })
        }

        res.status(200).json(result || {})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "Error" })
    }
})


router.delete("/suppliers/:id/contacts/:contact", async (req, res) => {
    try {
        const id = parseInt(req.params["id"])
        const contact = req.params["contact"]

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid paremeter 'id'" })
        }

        if (contact == undefined || contact.length < 1) {
            return res.status(400).json({ message: "Invalid paremeter 'contact'" })
        }

        {
            const [supplier, error] = await supplierManager.getSupplierById(id)
            if (error) {
                return res.status(400).json({ message: "An error occurred in the database" })
            }
            else if (supplier == undefined || supplier == null) {
                return res.status(400).json({ message: "Supplier not found" })
            }
        }

        const [result, error] = await supplierManager.deleteContact(id, contact)
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
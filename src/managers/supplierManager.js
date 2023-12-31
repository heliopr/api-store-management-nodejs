const database = require("../database")

const supplierManager = {}


supplierManager.getAllSuppliers = async function () {
    try {
        const result = await database.connection.query("SELECT * FROM suppliers ORDER BY id")
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}


supplierManager.countAllSuppliers = async function () {
    try {
        const result = await database.connection.query("SELECT COUNT(id) AS count FROM suppliers")
        return [result[0]["count"], null]
    }
    catch (e) {
        return [null, e]
    }
}


supplierManager.getSupplierById = async function (id) {
    try {
        const result = await database.connection.query("SELECT * FROM suppliers WHERE id = ? LIMIT 1", [id])
        return [result[0], null]
    }
    catch (e) {
        return [null, e]
    }
}


supplierManager.getSupplierByName = async function (name) {
    try {
        const result = await database.connection.query("SELECT * FROM suppliers WHERE name = ? LIMIT 1", [name])
        return [result[0], null]
    }
    catch (e) {
        return [null, e]
    }
}


supplierManager.createSupplier = async function (name) {
    try {
        const result = await database.connection.query("INSERT INTO suppliers (name) VALUES (?) RETURNING *", [name])
        return [result[0], null]
    }
    catch (e) {
        return [null, e]
    }
}


supplierManager.deleteSupplier = async function (id) {
    try {
        const result = await database.connection.query("DELETE FROM suppliers WHERE id = ? LIMIT 1", [id])
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}


supplierManager.setName = async function (id, newName) {
    try {
        const result = await database.connection.query("UPDATE suppliers SET name = ? WHERE id = ? LIMIT 1", [newName, id])
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}

supplierManager.getProducts = async function (id) {
    try {
        const result = await database.connection.query("SELECT product_id FROM product_supplier WHERE supplier_id = ?", [id])
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}

supplierManager.getContacts = async function(id) {
    try {
        const result = await database.connection.query("SELECT contact,type FROM supplier_contacts WHERE supplier_id = ?", [id])
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}

supplierManager.createContact = async function(id, type, contact) {
    try {
        const result = await database.connection.query("INSERT INTO supplier_contacts VALUES (?, ?, ?) RETURNING *", [id, type, contact])
        return [result[0], null]
    }
    catch (e) {
        return [null, e]
    }
}

supplierManager.getContactOwner = async function(contact) {
    try {
        const result = await database.connection.query("SELECT supplier_id FROM supplier_contacts WHERE contact = ? LIMIT 1", [contact])
        return [result[0], null]
    }
    catch (e) {
        return [null, e]
    }
}

supplierManager.deleteContact = async function(id, contact) {
    try {
        const result = await database.connection.query("DELETE FROM supplier_contacts WHERE supplier_id = ? AND contact = ? LIMIT 1", [id, contact])
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}


module.exports = supplierManager
const database = require("../database")

const categoryManager = {}

categoryManager.createCategory = async function(name) {
    try {
        const result = await database.connection.query("INSERT INTO product_categories (name) VALUES (?) RETURNING *", [name])
        return [result[0], null]
    }
    catch (e) {
        return [null, e]
    }
}

categoryManager.getAllCategories = async function() {
    try {
        const result = await database.connection.query("SELECT * FROM product_categories")
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}

categoryManager.getCategoryById = async function(id) {
    try {
        const result = await database.connection.query("SELECT * FROM product_categories WHERE id = ?", [id])
        return [result[0], null]
    }
    catch (e) {
        return [null, e]
    }
}

categoryManager.setName = async function(id, newName, returning=false) {
    try {
        if (returning) {
            const result = await database.connection.query("UPDATE product_categories SET name = ? WHERE id = ? RETURNING *", [newName, id])
            return [result[0], null]
        }
        else {
            const result = await database.connection.query("UPDATE product_categories SET name = ? WHERE id = ?", [newName, id])
            return [result, null]
        }
    }
    catch (e) {
        return [null, e]
    }
}

categoryManager.deleteCategory = async function(id) {
    try {
        const result = await database.connection.query("DELETE FROM product_categories WHERE id = ?", [id])
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}

module.exports = categoryManager
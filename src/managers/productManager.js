const database = require("../database")

const productManager = {}

productManager.insertProduct = async function(name, price, quantity, category=null) {
    try {
        const result = await database.connection.query("INSERT INTO products (name, price, quantity, category_id) VALUES (?, ?, ?, ?) RETURNING *", [name, price, quantity, category])
        return [result[0], null]
    }
    catch (e) {
        return [null, e]
    }
}

productManager.getProductById = function(id) {
    return productManager.getProductBy("id", id)
}

productManager.getProductByName = function(name) {
    return productManager.getProductBy("name", name)
}

productManager.getProductBy = async function(column, value) {
    try {
        const result = await database.connection.query(`SELECT * FROM products WHERE ${column} = ?`, [value])
        return [result[0], null]
    }
    catch (e) {
        return [null, e]
    }
}

productManager.setColumn = async function(column, newValue, returning=false) {
    try {
        if (returning) {
            const result = await database.connection.query(`UPDATE products SET ${column} = ? RETURNING *`, [newValue])
            return [result[0], null]
        }
        else {
            const result = await database.connection.query(`UPDATE products SET ${column} = ?`, [newValue])
            return [result, null]
        }
    }
    catch (e) {
        return [null, e]
    }
}

productManager.deleteProduct = async function(id) {
    try {
        const result = await database.connection.query("DELETE FROM products WHERE id = ?", [id])
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}

productManager.countAllProducts = async function() {
    try {
        const result = await database.connection.query("SELECT COUNT(id) AS count FROM products")
        return [result[0]["count"], null]
    }
    catch (e) {
        return [null, e]
    }
}

module.exports = productManager
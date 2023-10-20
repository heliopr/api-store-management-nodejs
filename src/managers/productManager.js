const database = require("../database")

const productManager = {}

productManager.createProduct = async function(name, price, quantity, category=null) {
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
        const result = await database.connection.query(`SELECT * FROM products WHERE ${column} = ? LIMIT 1`, [value])
        return [result[0], null]
    }
    catch (e) {
        return [null, e]
    }
}

productManager.getAllProducts = async function() {
    try {
        const result = await database.connection.query("SELECT * FROM products ORDER BY id")
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}

productManager.updateProduct = async function(product) {
    try {
        const result = await database.connection.query("UPDATE products SET name = ?, price = ?, quantity = ?, category_id = ? WHERE id = ? LIMIT 1", 
            [product.name, product.price, product.quantity, product.category_id, product.id])
        return [result, null]
    }
    catch (e) {
        return [null, e]
    }
}

productManager.deleteProduct = async function(id) {
    try {
        const result = await database.connection.query("DELETE FROM products WHERE id = ? LIMIT 1", [id])
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
        return [0, e]
    }
}

module.exports = productManager
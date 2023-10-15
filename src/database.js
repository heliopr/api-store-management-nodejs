const mariadb = require("mariadb")

const database = {}

database.connect = async function () {
    const host = process.env.DATABASE_HOST
    const user = process.env.DATABASE_USER
    const port = process.env.DATABASE_PORT

    console.log(`[DB] Connecting to ${host} port ${port} as ${user}`)
    try {
        database.connection = await mariadb.createConnection({
            host: host,
            user: user,
            port: port,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
            trace: true,
            connectionLimit: 5
        })
        console.log("[DB] Connected to MariaDB database!")
        return true
    }
    catch (e) {
        console.log("[DB] An error occurred when connecting to the database")
        console.log(e)
        return false
    }
}

database.setupTables = async function() {
    console.log("[DB] Setting up tables...")
    try {
        await database.connection.query(`CREATE TABLE IF NOT EXISTS product_categories(
            id TINYINT UNSIGNED AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE,

            CONSTRAINT pk_categories PRIMARY KEY (id)
        )`)

        await database.connection.query(`CREATE TABLE IF NOT EXISTS suppliers(
            id SMALLINT UNSIGNED AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE,

            CONSTRAINT pk_suppliers PRIMARY KEY (id)
        )`)

        await database.connection.query(`CREATE TABLE IF NOT EXISTS supplier_contacts(
            supplier_id SMALLINT UNSIGNED NOT NULL,
            type ENUM('email', 'phone_number') NOT NULL,
            contact VARCHAR(100) NOT NULL,

            CONSTRAINT fk_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )`)

        await database.connection.query(`CREATE TABLE IF NOT EXISTS products(
            id SMALLINT UNSIGNED AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE,
            price DECIMAL(15, 2) UNSIGNED,
            quantity SMALLINT UNSIGNED NOT NULL DEFAULT 0,
            category_id TINYINT UNSIGNED,

            CONSTRAINT pk_products PRIMARY KEY (id),
            CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES product_categories(id)
                ON DELETE SET NULL
                ON UPDATE CASCADE
        )`)

        await database.connection.query(`CREATE TABLE IF NOT EXISTS product_supplier(
            product_id SMALLINT UNSIGNED NOT NULL,
            supplier_id SMALLINT UNSIGNED NOT NULL,

            CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
            CONSTRAINT fk_product_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )`)

        await database.connection.query(`CREATE TABLE IF NOT EXISTS employees(
            id TINYINT UNSIGNED AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE,
            phone_number VARCHAR(14) NOT NULL UNIQUE,
            hire_date DATE NOT NULL,
            salary DECIMAL(15, 2),

            CONSTRAINT pk_employees PRIMARY KEY (id)
        )`)

        await database.connection.query(`CREATE TABLE IF NOT EXISTS sales(
            id SMALLINT UNSIGNED AUTO_INCREMENT,
            total DECIMAL(15, 2) NOT NULL,
            datetime DATETIME NOT NULL,
            employee_id TINYINT UNSIGNED,

            CONSTRAINT pk_sales PRIMARY KEY (id),
            CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
                ON DELETE SET NULL
                ON UPDATE CASCADE
        )`)

        await database.connection.query(`CREATE TABLE IF NOT EXISTS product_sale(
            sale_id SMALLINT UNSIGNED NOT NULL,
            product_id SMALLINT UNSIGNED NOT NULL,

            CONSTRAINT fk_sale FOREIGN KEY (sale_id) REFERENCES sales(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
            CONSTRAINT fk_product_sale FOREIGN KEY (product_id) REFERENCES products(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )`)

        console.log("[DB] Successfully set up tables")
        return true
    }
    catch(e) {
        console.log("[DB] An error occurred when creating tables")
        console.log(e)
        return false
    }
}

database.close = async function () {
    console.log("[DB] Closing database connection")
    await database.connection.end()
    console.log("[DB] Connection successfully closed")
}

module.exports = database
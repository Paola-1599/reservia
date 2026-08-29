import mysql from "mysql2/promise";

let pool;

export const connectDB = async () => {
    try {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST || "localhost",
            port: Number(process.env.MYSQL_PORT || 3306),
            user: process.env.MYSQL_USER || "root",
            password: process.env.MYSQL_PASSWORD || "",
            database: process.env.MYSQL_DATABASE || "reservia",
            waitForConnections: true,
            connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
            queueLimit: 0,
            charset: "utf8mb4",
            timezone: "Z",
        });

        await pool.query("SELECT 1");
        console.log("MySQL conectado correctamente");
    } catch (error) {
        console.error("Error al conectar a MySQL:", {
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            message: error.message,
            host: process.env.MYSQL_HOST || "localhost",
            port: Number(process.env.MYSQL_PORT || 3306),
            user: process.env.MYSQL_USER || "root",
            database: process.env.MYSQL_DATABASE || "reservia",
        });
        process.exit(1);
    }
};

export const getPool = () => {
    if (!pool) {
        throw new Error("Pool MySQL no inicializado. Ejecuta connectDB() primero.");
    }
    return pool;
};

export const closeDB = async () => {
    if (pool) {
        await pool.end();
    }
};

export default connectDB;
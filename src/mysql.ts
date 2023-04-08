import { Pool, createPool } from "mysql2/promise";

class Mysql {
    pool: Pool;

    constructor(options:{host: string, port: number, user: string, password: string, database: string}) {
        this.pool = createPool(options);
    }

    async execute(sql:string, data: any[]) {
        try {
        const result: any[] = await this.pool.query(sql, data);
        return result[0];
        } catch (e) {
            return 404;
        }
    }
}

if (!process.env.MYSQL_HOST) throw Error("Could not find MYSQL_HOST in your environment");
if (!process.env.MYSQL_PORT) throw Error("Could not find MYSQL_PORT in your environment");
if (!process.env.MYSQL_USER) throw Error("Could not find MYSQL_USER in your environment");
if (!process.env.MYSQL_PASSWORD) throw Error("Could not find MYSQL_PASSWORD in your environment");
if (!process.env.MYSQL_DATABASE) throw Error("Could not find MYSQL_DATABASE in your environment");

const mysqlController = new Mysql({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
export default mysqlController;
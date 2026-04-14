import 'dotenv/config';
import mysql from'mysql2/promise';

//Desing pattern: Singleton => permite a criação de apenas uma instancia da classe 
class Database {
    static #instance = null;
    #pool = null;

    #createPool(){
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit:0
        });
    }

    static getInstance(){
        if(!Database.#instance){
            Database.#instance = new Database();
            Database.#instance.#createPool();
        }                        // metodo que garante que apenas uma instancia seja criada
        return Database.#instance; 
    }

    getpool(){
        return this.#pool;
    }
}

export const connection = Database.getInstance().getpool();

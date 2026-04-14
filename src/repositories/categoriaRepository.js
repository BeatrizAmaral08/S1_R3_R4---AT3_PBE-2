import { connection } from "../configs/Database.js";

const categoriaRepository = {

    criar: async (categoria) => {
        const sql = 'INSERT INTO categorias (Nome, Descricao) VALUES (?, ?)';
        const values = [categoria.nome, categoria.descricao];

        const [result] = await connection.execute(sql, values);

        return {
            id: result.insertId,
            affectedRows: result.affectedRows
        };
    },

    editar: async (categoria) => {
        const sql = 'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?';
        const values = [categoria.nome, categoria.descricao, categoria.id];

        const [result] = await connection.execute(sql, values);

        return {
            affectedRows: result.affectedRows
        };
    },

    deletar: async (id) => {
        const sql = 'DELETE FROM categorias WHERE id = ?';
        const values = [id];
        const [result] = await connection.execute(sql, values);

        return {
            affectedRows: result.affectedRows
        };
    },

    selecionar: async () => {
        const sql = 'SELECT id, nome, descricao FROM categorias';
        const [rows] = await connection.execute(sql);
        return rows;
    }

};

export default categoriaRepository;
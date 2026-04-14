import { connection } from "../configs/Database.js";

const produtoRepository = {

    criar: async (produto) => {
        const sql = ` INSERT INTO produtos (nome, valor, idCategoria, caminhoImagem) VALUES (?, ?, ?, ?); `;
        const values = [produto.nome, produto.valor, produto.idCategoria, produto.caminhoImagem];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (produto) => {
        const sql = `UPDATE produtos SET nome = ?, valor = ?, idCategoria = ? WHERE idProduto = ?;`;
        const values = [produto.nome, produto.valor, produto.idCategoria, produto.idProduto];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (id) => {
        const sql = 'DELETE FROM produtos WHERE idProduto = ?;';
        const values = [id];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM produtos;';
        const [rows] = await connection.execute(sql);
        return rows;
    }

};

export default produtoRepository;
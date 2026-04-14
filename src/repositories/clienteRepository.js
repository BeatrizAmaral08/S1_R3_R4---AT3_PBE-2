import { connection } from "../configs/Database.js";

const clienteRepository = {
    criar: async (cliente, telefone, endereco) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const sqlCliente = 'INSERT INTO clientes (nome, cpf) VALUES (?, ?)';
            const valuesCliente = [cliente.nome, cliente.cpf];
            const [rowsCliente] = await conn.execute(sqlCliente, valuesCliente);

            const sqlEndereco = 'INSERT INTO enderecos (idCliente, cep, logradouro, numero, complemento, bairro, cidade, uf) VALUES (?,?,?,?,?,?,?,?)';
            const valuesEndereco = [rowsCliente.insertId,  endereco.cep, endereco.logradouro, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf];
            const [rowsEndereco] = await conn.execute(sqlEndereco, valuesEndereco);

            const sqlTelefone = 'INSERT INTO telefones (clienteId, telefone) VALUES (?,?)';
            const valuesTelefone = [rowsCliente.insertId, telefone.telefone];
            const [rowsTelefone] = await conn.execute(sqlTelefone, valuesTelefone);

            await connection.commit();

            return { rowsCliente, rowsEndereco, rowsTelefone };

        } catch (error) {
            connection.rollback(); 
            throw error;
        }
        finally{
            conn.relase();
        }
    }
}

export default clienteRepository;
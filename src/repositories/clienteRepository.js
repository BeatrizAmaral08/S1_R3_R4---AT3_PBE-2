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
            const valuesEndereco = [rowsCliente.insertId, endereco.cep, endereco.logradouro, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf];
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
        finally {
            conn.relase();
        }
    },

    //lista todos os clientes existentes
    listar: async () => {
        const conn = await connection.getConnection();
        try {
            //busca todos os clientes no banco de dados
            const [clientes] = await conn.execute('SELECT * FROM clientes');

            //para cada cliente, busca seu telefone e endereço cadastrados
            for (let cliente of clientes) {

                //busca os telefones do cliente
                const [telefones] = await conn.execute(
                    'SELECT telefone FROM telefones WHERE clienteId = ?',
                    [cliente.id]
                );

                //busca seus endereços
                const [enderecos] = await conn.execute(
                    'SELECT cep, logradouro, numero, complemento, bairro, cidade, uf FROM enderecos WHERE idCliente = ?',
                    [cliente.id]
                );

                //adiciona os dados no objeto do cliente
                cliente.telefones = telefones;
                cliente.enderecos = enderecos;
            }

            return clientes;

        } catch (error) {
            throw error;
        } finally {
            conn.release();
        }
    },

    //edita o cliente, telefone e o endereço
    editar: async (id, cliente, telefone, endereco) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            // verifica e tualiza os dados do cliente
            const sqlCliente = 'UPDATE clientes SET nome = ?, cpf = ? WHERE id = ?';
            const valuesCliente = [cliente.nome, cliente.cpf, id];
            await conn.execute(sqlCliente, valuesCliente);

            //atualiza o endereço
            const sqlEndereco = `UPDATE enderecos SET cep = ?, logradouro = ?, numero = complemento = ?, bairro = ?, cidade = ?, uf = ?  WHERE idCliente = ?`;

            const valuesEndereco = [
                endereco.cep, endereco.logradouro, endereco.numero,
                endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf, id
            ];
            await conn.execute(sqlEndereco, valuesEndereco);

            // Atualiza o telefone
            const sqlTelefone = 'UPDATE telefones SET telefone = ? WHERE clienteId = ?';
            const valuesTelefone = [telefone.telefone, id];
            await conn.execute(sqlTelefone, valuesTelefone);

            await conn.commit();

            return { message: "Cliente atualizado com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    //deleta cliente e os dados que estão relacionados 
    deletar: async (id) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            //deleta o telefone
            const sqlTelefone = 'DELETE FROM telefones WHERE clienteId = ?';
            await conn.execute(sqlTelefone, [id]);

            //Deleta endereço
            const sqlEndereco = 'DELETE FROM enderecos WHERE idCliente = ?';
            await conn.execute(sqlEndereco, [id]);

            // deleta o cliente
            const sqlCliente = 'DELETE FROM clientes WHERE id = ?';
            await conn.execute(sqlCliente, [id]);

            await conn.commit();

            return { message: "Cliente deletado com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
}

export default clienteRepository;
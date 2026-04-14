import { connection } from "../configs/Database.js";

const clienteRepository = {
    criar: async (cliente, telefone, endereco) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const sqlCliente = 'INSERT INTO clientes (nome, cpf) VALUES (?, ?)';
            const valuesCliente = [cliente.nome, cliente.cpf];
            const [rowsCliente] = await conn.execute(sqlCliente, valuesCliente);

            console.log(rowsCliente.insertId, endereco.cep, endereco.logradouro, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf);
            
            const sqlEndereco = 'INSERT INTO enderecos (idCliente, cep, logradouro, numero, complemento, bairro, cidade, uf) VALUES (?,?,?,?,?,?,?,?)';
            const valuesEndereco = [rowsCliente.insertId, endereco.cep, endereco.logradouro, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf];
            const [rowsEndereco] = await conn.execute(sqlEndereco, valuesEndereco);

            console.log(rowsCliente.insertId, telefone.numero)

            const sqlTelefone = 'INSERT INTO telefones (idCliente, telefone) VALUES (?,?)';
            const valuesTelefone = [rowsCliente.insertId, telefone.numero];
            const [rowsTelefone] = await conn.execute(sqlTelefone, valuesTelefone);

            await conn.commit();

            return { rowsCliente, rowsEndereco, rowsTelefone };

        } catch (error) {
           await conn.rollback();
            throw error;
        }
        finally {
            conn.release();
        }
    },

    //lista todos os clientes existentes
    listar: async () => {
        const conn = await connection.getConnection();
        try {
            //busca todos os clientes no banco de dados
            const [clientes] = await conn.execute('SELECT c.Nome, c.CPF, e.Cidade, t.NumeroTel* FROM clientes');

            //para cada cliente, busca seu telefone e endereço cadastrados
            for (let cliente of clientes) {
                console.log(cliente);
                
                //busca os telefones do cliente
                const [telefones] = await conn.execute(
                    'SELECT telefone FROM telefones WHERE idCliente = ?',
                    [cliente.idCliente]
                );

                //busca seus endereços
                const [enderecos] = await conn.execute(
                    'SELECT cep, logradouro, numero, complemento, bairro, cidade, uf FROM enderecos WHERE idCliente = ?',
                    [cliente.idCliente]
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
            console.log('cliente: ', cliente.nome, cliente.cpf, id)
            // verifica e tualiza os dados do cliente
            const sqlCliente = 'UPDATE clientes SET nome = ?, cpf = ? WHERE idCliente = ?';
            const valuesCliente = [cliente.nome, cliente.cpf, id];
            await conn.execute(sqlCliente, valuesCliente);
            
            console.log(endereco.cep, endereco.logradouro, endereco.numero,
                endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf, id)

            //atualiza o endereço
           const sqlEndereco = `UPDATE enderecos SET cep = ?, logradouro = ?, numero = ?, complemento = ?,bairro = ?, cidade = ?, uf = ?  WHERE idCliente = ?`;

            const valuesEndereco = [
                endereco.cep, endereco.logradouro, endereco.numero,
                endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf, id
            ];
            await conn.execute(sqlEndereco, valuesEndereco);


            console.log(telefone.numero, id);
            
            // Atualiza o telefone
            const sqlTelefone = 'UPDATE telefones SET telefone = ? WHERE idCliente = ?';
            const valuesTelefone = [telefone.numero, id];
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

    buscarPorId: async (id) => {
        const sql = 'SELECT * FROM clientes WHERE idCliente = ?';
        const [rows] = await connection.execute(sql, [id]);

        return rows.length > 0 ? rows[0] : null;
    },

    //deleta cliente e os dados que estão relacionados 
    deletar: async (id) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            //deleta o telefone
            const sqlTelefone = 'DELETE FROM telefones WHERE idCliente = ?';
            await conn.execute(sqlTelefone, [id]);

            //Deleta endereço
            const sqlEndereco = 'DELETE FROM enderecos WHERE idCliente = ?';
            await conn.execute(sqlEndereco, [id]);

            // deleta o cliente
            const sqlCliente = 'DELETE FROM clientes WHERE idCliente = ?';
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
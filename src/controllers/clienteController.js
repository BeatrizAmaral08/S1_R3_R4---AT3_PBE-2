

import { Cliente } from "../models/Cliente.js";
import { Endereco } from "../models/Endereco.js";
import { Telefone } from "../models/Telefone.js";
//import clienteRepository from "../repositories/clienteRepository.js";
import axios from "axios";

const clienteController = {

    criar: async (req, res) => {
        try {
            const { nome, cpf, telefone, cep, numero, complemento } = req.body;

            //valida o cep com 8 digitos
            const cepRegex = /^[0-9]{8}$/;
            if (!cepRegex.test(cep)) {
                return res.status(400).json({ message: 'Verifique o CEP informado' });
            }

            const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (respApi.data.erro) {
                return res.status(400).json({ message: 'CEP não encontrado na API ViaCEP' });
            }

            const endereco = new Endereco(
                respApi.data.logradouro,
                respApi.data.bairro,
                respApi.data.localidade,
                respApi.data.uf,
                respApi.data.cep,
                numero,
                complemento
            );

            //valida se telefone é um array
            const telefones = [];
            if (Array.isArray(telefone)) {
                for (let numeroTelefone of telefone) {
                    telefones.push(new Telefone(numeroTelefone));
                }
            } else {
                telefones.push(new Telefone(telefone));
            }

            const cliente = Cliente.criar({ nome, cpf, cep, telefone: telefones });

            cliente.endereco = endereco;

            const result = await clienteRepository.criar(cliente);

            res.status(201).json({ result });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },

    //seleciona um ou mais clientes pelo id dele
    selecionar: async (req, res) => {
        try {
            const { id } = req.params;

            if (id) {
                const cliente = await clienteRepository.buscarPorId(id);

                if (!cliente) {
                    return res.status(404).json({ message: 'Cliente não encontrado' });
                }

                return res.status(200).json(cliente);
            }

            const clientes = await clienteRepository.listar();
            res.status(200).json(clientes);

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao buscar clientes',
                errorMessage: error.message
            });
        }
    },

    //edita os dados do cliente buscando ele pelo id
    editar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, cpf, telefone, cep, numero, complemento } = req.body;

            //verifica se o cliente exise e puxa seu id
            const clienteExistente = await clienteRepository.buscarPorId(id);
            if (!clienteExistente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            //pega o atntigo endereco e atualiza ele
            let enderecoAtualizado = clienteExistente.endereco;

            if (cep) {
                const cepRegex = /^[0-9]{8}$/; //verifica se o cep tem 8 digitos certos
                if (!cepRegex.test(cep)) {
                    return res.status(400).json({ message: 'CEP inválido' });
                }

                //valida o cep pela Api
                const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (respApi.data.erro) {
                    return res.status(400).json({ message: 'CEP não encontrado' });
                }

                enderecoAtualizado = new Endereco(
                    respApi.data.logradouro, respApi.data.bairro, respApi.data.localidade, respApi.data.uf, respApi.data.cep, numero, complemento );
            }

            let telefonesAtualizados = clienteExistente.telefone; // atualiza o telefone pelo existente anteriormente

            if (telefone) {
                telefonesAtualizados = [];
                if (Array.isArray(telefone)) { //confere se o telefone inserido é um array
                    for (let numeroTelefone of telefone) {
                        telefonesAtualizados.push(new Telefone(numeroTelefone)); //push ediciona mais um elemento ao final do arra, no caso o telefone
                    }
                } else {
                    telefonesAtualizados.push(new Telefone(telefone));
                }
            }

            //dados atualizados do cliente
            const clienteAtualizado = {
                nome: nome || clienteExistente.nome,
                cpf: cpf || clienteExistente.cpf,
                telefone: telefonesAtualizados,
                endereco: enderecoAtualizado
            };

            const result = await clienteRepository.atualizar(id, clienteAtualizado);

            res.status(200).json(result);

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao atualizar cliente',
                errorMessage: error.message
            });
        }
    },

    deletar: async (req, res) => {
        try {
            const { id } = req.params; // busca o cliente pelo id para que possa deletar

            const clienteExistente = await clienteRepository.buscarPorId(id);
            if (!clienteExistente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            await clienteRepository.deletar(id);

            res.status(200).json({ message: 'Cliente deletado com sucesso' });

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao deletar cliente',
                errorMessage: error.message
            });
        }
    }

};

export default clienteController;

async function consultaCep(cep) {
    try {
        const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        if(respApi.data.erro){
            throw new Error('CEP não encontrado');
        }

        return respApi.data;
    } catch (error) {
        console.error(error)
        throw new Error('Erro ao buscar CEP', error.message);
    }
}

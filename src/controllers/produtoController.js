import { Produto } from "../models/Produto.js";
import produtoRepository from "../repositories/produtoRepository.js";

const produtoController = {

    criar: async (req, res) => {
        try {
            console.log('arq: ', req.file)
            if (!req.file) {
                return res.status(400).json({ message: 'Imagem não enviada' });
            }

            const { nome, valor, idCategoria } = req.body;

            // cria objetos com validações da classe
            const produto = Produto.criar({nome, valor, idCategoria, caminhoImagem: `/uploads/imagens/${req.file.filename}`});

            const result = await produtoRepository.criar(produto);
            res.status(201).json({ result });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },

    editar: async (req, res) => {
        try {
            const id = req.params.id;
            const { nome, valor, idCategoria } = req.body;

            let caminhoImagem = null;

            const produto = Produto.alterar({nome, valor, idCategoria, caminhoImagem}, id);
            const result = await produtoRepository.editar(produto);

            res.status(200).json({ result });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = req.params.id;

            if (!id || id <= 0) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            const result = await produtoRepository.deletar(id);
            res.status(200).json({ result });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await produtoRepository.selecionar();
            res.status(200).json({ result });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    }
};

export default produtoController;
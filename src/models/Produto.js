export class Produto {
    #idProduto;
    #idCategoria;
    #nome;
    #valor;
    #caminhoImagem;
    #dataCad;

    constructor(pNome, pValor, pIdCategoria, pCaminhoImagem, pIdProduto){
        this.nome = pNome;
        this.valor = pValor;
        this.idCategoria = pIdCategoria;
        this.caminhoImagem = pCaminhoImagem;
        this.idProduto = pIdProduto;
    }

    // GETTERS E SETTERS

    get idProduto(){
        return this.#idProduto;
    }

    set idProduto(value){
        this.#validarIdProduto(value);
        this.#idProduto = value;
    }



    get idCategoria(){
        return this.#idCategoria;
    }

    set idCategoria(value){
        this.#validarIdCategoria(value);
        this.#idCategoria = value;
    }



    get nome(){
        return this.#nome;
    }

    set nome(value){
        this.#validarNome(value);
        this.#nome = value;
    }



    get valor(){
        return this.#valor;
    }

    set valor(value){
        this.#validarValor(value);
        this.#valor = value;
    }



    get caminhoImagem(){
        return this.#caminhoImagem;
    }

    set caminhoImagem(value){
        this.#validarPathImagem(value);
        this.#caminhoImagem = value;
    }



    get dataCad(){
        return this.#dataCad;
    }

    set dataCad(value){
        this.#dataCad = value;
    }



    // metodos auxiliares 

    #validarIdProduto(value){
        if (value && value <= 0){
            throw new Error('Verifique o ID do produto');
        }
    }

    #validarIdCategoria(value){
        if (!value || value <= 0){
            throw new Error('O ID da categoria é obrigatório e deve ser maior que zero');
        }
    }

    #validarNome(value){
        if (!value || value.trim().length < 3 || value.trim().length > 45){
            throw new Error('O campo nome deve ter entre 3 e 45 caracteres');
        }
    }

    #validarValor(value){
        if (value == null || value <= 0){
            throw new Error('O valor deve ser maior que zero');
        }
    }

    #validarPathImagem(value){
        if (value){
            if(value.trim().length < 5) {
                throw new Error('O caminho da imagem é inválido');
            }
        }
    }


    // criação de objetos FACTORY METHODS

    static criar(dados){
        return new Produto( dados.nome, dados.valor, dados.idCategoria, dados.caminhoImagem, null);
    }

    static alterar(dados, id){
        return new Produto(dados.nome, dados.valor, dados.idCategoria, dados.caminhoImagem, id);
    }
}
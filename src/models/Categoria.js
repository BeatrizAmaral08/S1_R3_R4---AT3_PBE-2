export class Categoria {
    #id;
    #nome;
    #descricao;
    #dataCad;

    constructor(pNome, pDescricao, pId = null) {
        this.id = pId;
        this.nome = pNome;
        this.descricao = pDescricao;
        this.#dataCad = new Date();
    }

    // GETTERS e SETTERS
    get id() {
        return this.#id;
    }

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get nome() {
        return this.#nome;
    }

    set nome(value) {
        this.#validarNome(value);
        this.#nome = value.trim();
    }

    get descricao() {
        return this.#descricao;
    }

    set descricao(value) {
        this.#validarDescricao(value);
        this.#descricao = value?.trim() || null;
    }

    get dataCad() {
        return this.#dataCad;
    }

    // Métodos auxiliares de validação
    #validarId(value) {
        if (value !== null && value !== undefined && value <= 0) {
            throw new Error('Verifique o ID informado');
        }
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 45) {
            throw new Error('O campo nome é obrigatório e deve ter entre 3 e 45 caracteres');
        }
    }

    #validarDescricao(value) {
        if (value && (value.trim().length < 10 || value.trim().length > 100)) {
            throw new Error('O campo descrição deve ter entre 10 e 100 caracteres');
        }
    }

    // FACTORY METHOD
    static criar(dados) {
        console.log(dados.nome, dados.descricao);
        
        return new Categoria(dados.nome, dados.descricao);
    }

    static alterar(dados) {
        return new Categoria(dados.nome, dados.descricao, dados.id);
    }
}
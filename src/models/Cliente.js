export class Cliente {
    #id;
    #nome;
    #cpf;
    #dataCad;

    //  armazena CPFs já cadastrados
    static cpfsCadastrados = [];

    constructor(pNome, pCpf = null, pId = null) {
        this.id = pId;
        this.nome = pNome;
        this.cpf = pCpf;
        this.#dataCad = new Date();
    }

    //GET E SET
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
        this.validarNome(value);
        this.#nome = value.trim();
    }

    get cpf() {
        return this.#cpf;
    }

    set cpf(value) {
        // this.validarCpf(value);          // valida o cfp antes de setar
        const cpfLimpo = value.replace(/\D/g, ''); // remove caracteres que não forem numéricos
        this.#cpf = cpfLimpo;

        // adiciona à lista de CPFs cadastrados se ainda não estiver
        if (!Cliente.cpfsCadastrados.includes(cpfLimpo)) {
            Cliente.cpfsCadastrados.push(cpfLimpo);
        }
    }
    get dataCad() {
        return this.#dataCad;
    }

    validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error('Nome deve ter entre 3 e 100 caracteres');
        }
        return true;
    }

    validarCpf(value) {
        console.log(value)
        if (!value) throw new Error('CPF não informado');

        // Verifica se tem 11 dígitos ou se é sequência repetida
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            return false;
        }

        let soma = 0;
        let resto;

        // Validação do 1º dígito
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;


        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) {
            return false;
        }


        soma = 0;


        // Validação do 2º dígito
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;


        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) {
            return false;
        }

        return true;
    }


    #validarId(value) {
        if (value !== null && value !== undefined && value <= 0) {
            throw new Error('Verifique o ID informado');
        }
    }

    static criar(dados) {
        return new Cliente(dados.nome, dados.cpf, dados.cep, Array.isArray(dados.telefone) ? dados.telefone : [dados.telefone]
        );
    }
}
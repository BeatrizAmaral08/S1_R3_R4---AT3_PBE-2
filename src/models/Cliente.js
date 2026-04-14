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
        this.validarCpf(value);          // valida o cfp antes de setar
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

        // remove caracteres não numéricos
        const cpfLimpo = value.replace(/\D/g, ''); // '' = remove pontos, traços, espaços, letras etc,
        ///\D/ = indica qualquer caractere que não seja um dígito (ex: ., -)
        //g = substitui todas as ocorrências do padrão, não só a primeira”.
    

        // verifica se tem 11 dígitos
        if (cpfLimpo.length !== 11) {
            throw new Error('CPF deve ter exatamente 11 dígitos');
        }

        // verifica se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpfLimpo)) {
            throw new Error('CPF não pode ter todos os números iguais');
            //^ = indica início da string
            //(\d) = captura o primeiro dígito e guarda em um grupo.
            //\1{10} = \1 significa que capturou o mesmo dígito do início
            //{10} = repete 10 vezes.
            //$ = indica fim da string.
        }

      
        return true;
    }


    #validarId(value) {
        if (value !== null && value !== undefined && value <= 0) {
            throw new Error('Verifique o ID informado');
        }
    }

    static criar(dados) {
        return new Cliente(
            dados.nome,
            dados.cpf,
            dados.cep,
            Array.isArray(dados.telefone) ? dados.telefone : [dados.telefone]
        );
    }
}
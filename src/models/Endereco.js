export class Endereco {
    #logradouro;
    #bairro;
    #cidade;
    #estado;
    #cep;
    #numero;
    #complemento;

    constructor(logradouro, bairro, cidade, estado, cep, numero, complemento) {
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
        this.numero = numero;
        this.complemento = complemento;
    }

    get logradouro() {
        return this.#logradouro;
    }


    set logradouro(value) {
        if (!value || value.length < 3) throw new Error("Logradouro inválido");
        this.#logradouro = value;
    }

    get bairro() {
        return this.#bairro;
    }

    set bairro(value) {
        this.#bairro = value;
    }

    get cidade() {
        return this.#cidade;
    }

    set cidade(value) {
        this.#cidade = value;
    }


    get estado() {
        return this.#estado;
    }

    set estado(value) {
        this.#estado = value;
    }

    get cep() {
        return this.#cep;
    }
    set cep(value) {
        this.#cep = value;
    }

    get numero() { 
        return this.#numero; 
    }

    set numero(value) {
         this.#numero = value; 
        }

    get complemento() { 
        return this.#complemento; 
    }

    set complemento(value) { 
        this.#complemento = value;
     }
}
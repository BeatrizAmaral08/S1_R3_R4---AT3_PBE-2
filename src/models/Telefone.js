export class Telefone {
    #numero;

    constructor(numero) {
        this.numero = numero;
    }

    get numero() {
        return this.#numero;
    }

    set numero(value) {
        const telRegex = /^[0-9]{10,11}$/;
        if (!telRegex.test(value)) {
            throw new Error("Telefone inválido");
        }
        this.#numero = value;
    }
}
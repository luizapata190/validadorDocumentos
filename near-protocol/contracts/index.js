import { NearBindgen, call, view, near } from 'near-sdk-js';

@NearBindgen({})
class VerificadorDocumentos {
    constructor() {
        this.registros = {};
    }

    @call({})
    registrar_documento({ hashDocumento }) {
        const propietario = near.predecessorAccountId();
        const fechaNanosegundos = near.blockTimestamp();
        const fechaSegundos = Math.floor(Number(fechaNanosegundos) / 1_000_000_000);

        if (this.registros[hashDocumento]) {
            throw new Error("Este documento ya fue registrado previamente en la red NEAR.");
        }

        this.registros[hashDocumento] = {
            propietario: propietario,
            fecha: fechaSegundos,
            estaRegistrado: true
        };

        near.log(`Documento registrado por: ${propietario}`);
    }

    @view({})
    verificar_documento({ hashDocumento }) {
        const doc = this.registros[hashDocumento];

        if (!doc) {
            return { estaRegistrado: false };
        }

        return doc;
    }
}
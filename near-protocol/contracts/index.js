import { NearBindgen, call, view, near } from 'near-sdk-js';

@NearBindgen({})
class VerificadorDocumentos {
    constructor() {
        // Estructura de almacenamiento en memoria permanente de NEAR
        this.registros = {};
    }

    /**
     * FUNCIÓN DE ESCRITURA (Consume Gas)
     * Registra el Hash SHA-256 vinculándolo a la cuenta de NEAR del usuario.
     */
    @call({})
    registrar_documento({ hashDocumento }) {
        // En NEAR, obtenemos el nombre de cuenta formateado (ej. "usuario.testnet")
        const propietario = near.predecessorAccountId();

        // Convertimos el tiempo del bloque (nanosegundos) a segundos Unix
        const fechaNanosegundos = near.blockTimestamp();
        const fechaSegundos = Math.floor(Number(fechaNanosegundos) / 1_000_000_000);

        // Control de Duplicados (Protección de inmutabilidad)
        if (this.registros[hashDocumento]) {
            throw new Error("Este documento ya fue registrado previamente en la red NEAR.");
        }

        // Guardamos el registro en la memoria del contrato
        this.registros[hashDocumento] = {
            propietario: propietario,
            fecha: fechaSegundos,
            estaRegistrado: true
        };

        near.log(`Documento ${hashDocumento.substring(0, 10)}... registrado con éxito por: ${propietario}`);
    }

    /**
     * FUNCIÓN DE LECTURA (Gratuita)
     * Consulta el estado de un documento a partir de su Hash.
     */
    @view({})
    verificar_documento({ hashDocumento }) {
        const doc = this.registros[hashDocumento];

        if (!doc) {
            return { estaRegistrado: false };
        }

        return doc;
    }
}
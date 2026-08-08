// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerificadorDocumentos {

    // 1. Estructura de los datos: ¿Qué queremos guardar de cada documento?
    struct Documento {
        address propietario; // La billetera de quien lo registró
        uint256 fecha;       // La fecha y hora exacta del registro
        bool estaRegistrado; // Un simple "Sí/No" para saber si existe
    }

    // 2. El "Libro de Registro" (Un diccionario que asocia el Hash con el Documento)
    mapping(string => Documento) public registros;

    // 3. Un "Altavoz" para anunciar al mundo que se registró algo nuevo
    event DocumentoRegistrado(string hash, address propietario, uint256 fecha);

    // 4. FUNCIÓN PARA REGISTRAR: Escribir en la blockchain
    function registrarDocumento(string memory _hashDocumento) public {
        // Verificamos que el documento no haya sido registrado antes
        require(registros[_hashDocumento].estaRegistrado == false, "Este documento ya existe.");

        // Guardamos los datos en nuestro libro de registro
        registros[_hashDocumento] = Documento({
            propietario: msg.sender,     // msg.sender es la billetera que está ejecutando esto
            fecha: block.timestamp,      // block.timestamp es la hora exacta de la red
            estaRegistrado: true         // Marcamos que ya existe
        });

        // Hacemos el anuncio público
        emit DocumentoRegistrado(_hashDocumento, msg.sender, block.timestamp);
    }

    // 5. FUNCIÓN PARA VERIFICAR: Leer de la blockchain (¡Esto es gratis!)
    function verificarDocumento(string memory _hashDocumento) public view returns (address, uint256, bool) {
        Documento memory doc = registros[_hashDocumento];

        // Devolvemos quién lo registró, cuándo, y si existe
        return (doc.propietario, doc.fecha, doc.estaRegistrado);
    }
}
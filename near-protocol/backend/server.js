const express = require('express');
const cors = require('cors');
const nearAPI = require('near-api-js');
const os = require('os');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de NEAR
const ACCOUNT_ID = 'luinos.testnet';
const CREDENTIALS_DIR = path.join(os.homedir(), '.near-credentials');

async function initNear() {
    console.log("   -> 🔑 Inicializando Keystore local...");
    const keyStore = new nearAPI.keyStores.UnencryptedFileSystemKeyStore(CREDENTIALS_DIR);
    console.log("   -> 🌐 Conectando al nodo RPC oficial de NEAR...");
    return await nearAPI.connect({
        networkId: 'testnet',
        keyStore: keyStore,
        nodeUrl: 'https://rpc.testnet.near.org'
    });
}

// 📌 1. Ruta para REGISTRAR el documento
app.post('/api/registrar', async (req, res) => {
    console.log("\n========================================");
    console.log("📥 [REGISTRO] Petición recibida");

    try {
        const { hashDocumento } = req.body;
        if (!hashDocumento) {
            console.log("❌ [ERROR] Hash no proporcionado");
            return res.status(400).json({ error: 'Hash requerido' });
        }

        console.log(`📦 Hash a registrar: ${hashDocumento}`);
        console.log("⏳ [1] Conectando a la red...");
        const near = await initNear();

        console.log(`✅ [2] Preparando cuenta: ${ACCOUNT_ID}...`);
        const account = await near.account(ACCOUNT_ID);

        console.log("📝 [3] Firmando transacción (esperando validación del contrato)...");
        const result = await account.functionCall({
            contractId: ACCOUNT_ID,
            methodName: 'registrar_documento',
            args: { hashDocumento: hashDocumento },
            gas: '300000000000000'
        });

        console.log("🎉 [ÉXITO] ¡Documento estampado en NEAR!");
        console.log("🔗 TxID:", result.transaction.hash);
        res.json({ success: true, transactionId: result.transaction.hash });

    } catch (error) {
        // 🛡️ FILTRO DE ERRORES INTELIGENTE
        const mensajeError = error.message || "";

        if (mensajeError.includes("Este documento ya fue registrado")) {
            console.log("⚠️ [RECHAZADO] El contrato bloqueó un documento duplicado.");
            // Le mandamos un mensaje limpio al frontend (Código HTTP 409: Conflicto)
            return res.status(409).json({
                success: false,
                error: "Este documento ya se encuentra registrado en la notaría."
            });
        }

        // Si es otro error raro, lo mostramos resumido para no ensuciar la terminal
        console.error("❌ [ERROR CRÍTICO] Ocurrió un fallo:", mensajeError.split('\n')[0]);
        res.status(500).json({ success: false, error: "Error interno al comunicarse con la blockchain." });
    }
});

// 📌 2. Ruta para VERIFICAR el documento
app.get('/api/verificar/:hash', async (req, res) => {
    console.log("\n========================================");
    console.log("🔍 [VALIDACIÓN] Petición recibida");
    console.log("📦 Hash consultado:", req.params.hash);

    try {
        console.log("⏳ [1] Conectando en modo lectura...");
        const near = await initNear();

        console.log("📖 [2] Consultando la Blockchain...");
        const response = await near.connection.provider.query({
            request_type: 'call_function',
            finality: 'optimistic',
            account_id: ACCOUNT_ID,
            method_name: 'verificar_documento',
            args_base64: Buffer.from(JSON.stringify({ hashDocumento: req.params.hash })).toString('base64')
        });

        console.log("⚙️ [3] Decodificando respuesta...");
        const data = JSON.parse(Buffer.from(response.result).toString());

        if (data.estaRegistrado) {
            console.log("✅ [RESULTADO] El documento ES AUTÉNTICO.");
        } else {
            console.log("⚠️ [RESULTADO] El documento NO EXISTE.");
        }

        res.json({ success: true, data: data });
    } catch (error) {
        console.error("❌ [ERROR] Falló la verificación.");
        res.status(500).json({ success: false, error: "Fallo al consultar la red." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n✅ Backend Notario NEAR (Con Filtro de Errores) escuchando en puerto ${PORT}\n`);
});
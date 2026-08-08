const express = require('express');
const cors = require('cors');
// 👇 AQUÍ ESTÁ EL CAMBIO: Extraemos keyStores y connect directamente
const { keyStores, connect } = require('near-api-js');
const os = require('os');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de NEAR
const ACCOUNT_ID = 'luinos.testnet';
const CREDENTIALS_DIR = path.join(os.homedir(), '.near-credentials');

async function initNear() {
    // Usamos keyStores directamente
    const keyStore = new keyStores.UnencryptedFileSystemKeyStore(CREDENTIALS_DIR);

    // Usamos connect directamente
    return await connect({
        networkId: 'testnet',
        keyStore: keyStore,
        nodeUrl: 'https://testnet.rpc.fastnear.com'
    });
}

// 📌 1. Ruta para REGISTRAR el documento
app.post('/api/registrar', async (req, res) => {
    try {
        const { hashDocumento } = req.body;
        if (!hashDocumento) return res.status(400).json({ error: 'Hash requerido' });

        const near = await initNear();
        const account = await near.account(ACCOUNT_ID);

        // El servidor firma y envía la transacción a la blockchain
        const result = await account.functionCall({
            contractId: ACCOUNT_ID,
            methodName: 'registrar_documento',
            args: { hashDocumento: hashDocumento },
            gas: '300000000000000'
        });

        res.json({
            success: true,
            transactionId: result.transaction.hash
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 2. Ruta para VERIFICAR el documento
app.get('/api/verificar/:hash', async (req, res) => {
    try {
        const near = await initNear();
        const response = await near.connection.provider.query({
            request_type: 'call_function',
            finality: 'optimistic',
            account_id: ACCOUNT_ID,
            method_name: 'verificar_documento',
            args_base64: Buffer.from(JSON.stringify({ hashDocumento: req.params.hash })).toString('base64')
        });

        const data = JSON.parse(Buffer.from(response.result).toString());
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Iniciar servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend del Notario NEAR corriendo en http://localhost:${PORT}`);
});
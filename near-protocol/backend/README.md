# Notario Digital — Backend NEAR

Servidor **Express** que expone una API REST y firma transacciones contra el
contrato `registrar_documento` / `verificar_documento` desplegado en
**NEAR Protocol (testnet)**. Usa las credenciales locales de NEAR
(`~/.near-credentials`) para firmar; el frontend nunca ve la clave privada.

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/registrar` | Body `{ "hashDocumento": "<sha256>" }` → registra el hash en la blockchain. `409` si ya existe. |
| GET | `/api/verificar/:hash` | Consulta (gratis, `view`) si un hash está registrado; devuelve propietario y fecha. |

## Requisitos

- Node.js 18+ y npm
- Una cuenta de **NEAR testnet** con sus credenciales en
  `~/.near-credentials/testnet/<cuenta>.testnet.json`
  (se obtienen en https://testnet.mynearwallet.com → *Security & Recovery*).
- El contrato ya desplegado en esa cuenta (ver `../contracts/README` del
  módulo `near-protocol`).

## Instalación

```bash
cd near-protocol/backend
npm install
```

## Configuración

```bash
cp .env.example .env     # opcional: sin .env usa los defaults (luinos.testnet, testnet)
```

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `3000` | Puerto del servidor |
| `NEAR_ACCOUNT_ID` | `luinos.testnet` | Cuenta que firma (debe tener credenciales locales) |
| `NEAR_NETWORK_ID` | `testnet` | `testnet` / `mainnet` |
| `NEAR_NODE_URL` | `https://rpc.testnet.near.org` | Nodo RPC |
| `NEAR_CREDENTIALS_DIR` | `~/.near-credentials` | Carpeta de credenciales |

## Cómo ejecutarlo

```bash
npm start          # node server.js
npm run dev        # node --watch server.js (recarga al guardar)
```

El servidor imprime al arrancar: `Backend Notario NEAR escuchando en puerto 3000`.

## Solución de problemas

| Síntoma | Causa |
|---|---|
| `Error: Key not found` / `No matching key pair` | No hay credenciales en `~/.near-credentials/<red>/<cuenta>.json`, o `NEAR_ACCOUNT_ID` no coincide con el archivo |
| `TypeError: near.account is not a function` | Versión de `near-api-js` incompatible (este código está escrito para la v2) |
| `409` al registrar | El documento ya estaba registrado (comportamiento correcto del contrato) |
| El frontend no conecta | CORS ya está abierto; revisar que el frontend apunte a `http://localhost:3000` |

## Nota de mantenimiento

`near-api-js@2.1.4` está desactualizado (la línea estable actual es v5 /
paquetes `@near-js/*`). Migrar requiere reescribir `initNear`,
`account.functionCall` y `provider.query`, y probar contra testnet. Ver
`../../AUDITORIA.md`.

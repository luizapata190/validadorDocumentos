# Auditoría — validadorDocumentos (Notario Digital Web3)

Fecha: 2026-08-31 · Auditor: Jarvis
Skills aplicadas: `deploy-security-standard`, `web3-blockchain-expert-persona`

## Qué es

Monorepo **multichain** de un "Notario Digital": registra la huella
SHA-256 de un documento en blockchain como prueba de existencia
(*Proof of Existence*), sin subir el archivo. Dos implementaciones:

- **`evm-polygon/`** — contrato Solidity (`VerificadorDocumentos`) + dApp
  HTML/JS con Ethers.js v5. Desplegado en Sepolia testnet
  (`0x547abE743cd2561FB13cE7BfabA31cD8EFF6b95f`). Se opera desde Remix IDE.
- **`near-protocol/`** — contrato en JS (`near-sdk-js`, compilado a wasm) +
  backend Express que firma transacciones con las credenciales locales de
  NEAR + frontend HTML con `near-api-js`.

Repo con remoto en `github.com/luizapata190/validadorDocumentos`, rama `main`,
LICENSE MIT.

## Hallazgos

| # | Hallazgo | Severidad | Acción |
|---|---|---|---|
| 1 | **`~/proyectos/web3/.git` es un repo wrapper vacío** (0 commits, 0 archivos, sin remoto) envolviendo `validadorDocumentos/`, que ya es su propio repo con remoto. Genera confusión sobre cuál es el repo real. | Media | ✅ Eliminado el wrapper `web3/.git`. `web3/` queda como carpeta contenedora simple (igual que `python/`). |
| 2 | **`node_modules` de `near-protocol` = 298 MB locales** (286 MB en `contracts/`, 12 MB en `backend/`). No trackeados (el `.gitignore` los excluye bien), pero ocupan espacio y no aportan nada versionable. | Baja | ✅ Enviados a papelera (`trash`). Se regeneran con `npm install`. |
| 3 | **`near-protocol/backend/` sin `README.md` ni `.env.example` ni script `start`.** Para arrancarlo hay que leer `server.js`. | Media | ✅ Creado `README.md` + `.env.example` + `scripts.start` en `package.json` |
| 4 | **`backend/server.js` con valores hardcodeados:** `PORT = 3000`, `ACCOUNT_ID = 'luinos.testnet'`, `nodeUrl` fijo. Cambiar de cuenta o de red obliga a editar el código. | Media | ✅ Refactor: leídos de env (`PORT`, `NEAR_ACCOUNT_ID`, `NEAR_NETWORK_ID`, `NEAR_NODE_URL`) con los mismos valores por defecto → comportamiento idéntico si no hay `.env` |
| 5 | **`backend/package.json` incompleto:** `description` vacía, `keywords` vacío, sin `start`. `near-api-js ^2.1.4` está desactualizado (hoy la línea estable es v5 / paquetes `@near-js/*`). | Baja | ✅ `description`, `keywords`, `scripts.start` añadidos. Upgrade de `near-api-js` **NO** aplicado en esta pasada: requiere reescribir llamadas y probar contra testnet con credenciales reales — documentado como pendiente. |
| 6 | **`example_hash.json` no es JSON válido** (tiene comentarios `//`). Es ilustrativo y nada lo importa, pero rompería un `JSON.parse`. Además el ejemplo mezcla conceptos (parece un payload de transferencia, no un registro de notario). | Baja | ✅ Reescrito como JSON válido representando un registro real del notario + explicación movida al `README` |
| 7 | **Credenciales:** el backend NEAR firma con `~/.near-credentials/testnet/luinos.testnet.json` (clave privada `ed25519`). Está **fuera** del repo (correcto). El `.gitignore` ya excluye `*.pem`, `*.key`, `id_ed25519*`, `.env`. | OK | Ninguna. Recordatorio: es testnet; nunca poner una cuenta mainnet con fondos ahí. |
| 8 | `.gitignore`, `LICENSE` (MIT), `README.md` (raíz + por módulo) ya presentes y correctos. | OK | Ninguna |
| 9 | Contratos con direcciones/IDs hardcodeados en los `index.html` — es información **pública** de una dApp (dirección de contrato desplegado). Aceptable. | OK | Ninguna |

## Método de verificación

- `git -C validadorDocumentos ls-files` → confirmado que `node_modules` y
  `build/` no están trackeados.
- `grep -rn` de claves privadas / mnemónicos / JWT en todo el árbol → limpio.
- `node -c backend/server.js` → sintaxis OK tras el refactor.
- Contrato Solidity y contrato NEAR: revisión de lógica (registro idempotente
  con `require` / `throw` ante hash duplicado, `view` gratuito para verificar).
  Lógica correcta y equivalente entre ambas cadenas.

## Pendiente (fuera de alcance de esta pasada)

- **Upgrade `near-api-js` v2 → v5** (o migrar a `@near-js/*`). Necesita
  reescribir `initNear`, `account.functionCall` y el `provider.query`, y
  validar contra NEAR testnet con las credenciales reales.
- **Tests:** ninguno de los dos módulos tiene tests. Para EVM: Hardhat +
  Foundry. Para NEAR: `near-workspaces`.
- **Frontend EVM:** mover la config del contrato (`CONTRACT_ADDRESS`, `ABI`)
  a un `config.js` aparte en vez de editar `index.html` a mano.
- **Despliegue real del frontend** (GitHub Pages / Vercel) si se quiere uso
  público — hoy se abre el `index.html` local.
- `near-protocol/contracts/build/` local con el `.wasm` compilado: se puede
  borrar, se regenera con `npm run build`.

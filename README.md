# 📜 Notario Digital Web3

Una aplicación descentralizada (dApp) sencilla que permite a cualquier usuario registrar la "huella digital" (Hash SHA-256) de un documento en la blockchain. Esto sirve como **Prueba de Existencia (Proof of Existence)**, garantizando que un archivo existía en una fecha específica y que no ha sido alterado, sin necesidad de revelar o subir el documento original a internet.

## 🚀 Características Principales

*   **Privacidad absoluta:** El archivo original (PDF, imagen, etc.) nunca sale del dispositivo del usuario. La app calcula el Hash SHA-256 localmente en el navegador.
*   **Inmutabilidad:** Una vez que la huella digital se registra en el Smart Contract, nadie (ni siquiera el creador) puede borrarla o modificarla.
*   **Conexión Web3:** Integración directa con billeteras criptográficas mediante MetaMask y Ethers.js.
*   **Costo de red (Pruebas):** Desplegado actualmente en la red de pruebas **Ethereum Sepolia**, lo que permite usar la aplicación sin gastar dinero real.

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript.
*   **Librería Web3:** [Ethers.js (v5.7.2)](https://docs.ethers.org/v5/) para conectar el Frontend con la Blockchain.
*   **Smart Contract:** Solidity (`^0.8.0`).
*   **Entorno de Desarrollo:** [Remix IDE](https://remix.ethereum.org/).
*   **Billetera:** [MetaMask](https://metamask.io/).

---

## 📂 Estructura del Proyecto

El proyecto consta de dos partes principales:

1.  `Verificador.sol`: El código del Contrato Inteligente que vive en la blockchain.
2.  `index.html`: La interfaz gráfica de usuario que interactúa con el contrato inteligente.

---

## ⚙️ Instalación y Configuración (Entorno de Pruebas)

### 1. Pre-requisitos
Para ejecutar y probar esta aplicación, necesitas:
*   Un navegador web (Chrome, Firefox, Brave, etc.).
*   La extensión [MetaMask](https://metamask.io/download/) instalada y configurada.
*   Activar la red **Sepolia Testnet** en tu MetaMask.
*   Obtener fondos de prueba (SepoliaETH) desde un [Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia).

### 2. Configurar el Smart Contract (Remix IDE)
1.  Abre [Remix IDE](https://remix.ethereum.org/).
2.  Crea un archivo llamado `Verificador.sol` y pega el código de Solidity.
3.  Compila el contrato (Ctrl + S o usando el botón *Compile*).
4.  Ve a la pestaña *Deploy & Run Transactions*, selecciona el entorno **"Injected Provider - MetaMask"**.
5.  Haz clic en **Deploy** y aprueba la transacción en tu billetera.
6.  Copia la **Dirección del Contrato (Contract Address)** generada.
7.  Ve al compilador y copia el **ABI**.

### 3. Configurar el Frontend
1.  Abre el archivo `index.html` en un editor de texto o código.
2.  Busca la línea de código JavaScript: `const CONTRACT_ADDRESS = "...";` y reemplázala con la dirección de tu contrato desplegado.
3.  Asegúrate de que la variable `CONTRACT_ABI` contiene el ABI correcto generado en Remix.
4.  Guarda los cambios.

---

## 💻 ¿Cómo usar la Aplicación?

1.  Haz doble clic en el archivo `index.html` para abrirlo en tu navegador.
2.  Haz clic en el botón **"1. Conectar Billetera"**. Autoriza la conexión en la ventana emergente de MetaMask.
3.  Haz clic en **"Seleccionar archivo"** y elige un documento (ej. un PDF) desde tu computadora.
4.  Haz clic en **"2. Registrar Documento"**. La aplicación calculará la huella digital localmente.
5.  Confirma la transacción en MetaMask (pagando el gas con SepoliaETH de prueba).
6.  ¡Listo! Espera unos segundos y verás un mensaje de éxito cuando el documento quede inmutable en la blockchain.

---

## 🔮 Próximos Pasos (Paso a Producción)

Para llevar esta aplicación al mundo real (Mainnet) y usarla de forma productiva:
1.  **Cambiar de red:** Desplegar el mismo contrato `Verificador.sol` en una red Layer-2 de bajo costo, como **Polygon Mainnet** o **Base Mainnet**, para que las tarifas de transacción sean fracciones de centavo.
2.  **Actualizar variables:** Reemplazar el `CONTRACT_ADDRESS` en `index.html` por la nueva dirección de producción.
3.  **Hosting web:** Subir el archivo `index.html` a un servicio de hosting (como GitHub Pages, Vercel o Netlify) para que cualquier persona en el mundo pueda acceder mediante una URL pública (ej. `www.mi-notario-digital.com`).
4.  **Buscador Público:** Agregar un campo de texto extra en el HTML para que cualquier usuario pueda pegar una huella digital y llamar a la función `verificarDocumento` (la cual es 100% gratuita) para comprobar si un archivo es auténtico.
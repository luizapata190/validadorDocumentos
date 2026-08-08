# **🟢 Notario Digital Web3 \- NEAR Protocol**

Este módulo forma parte del Monorepo **Notaria Digital Web3**. Permite certificar la autenticidad e inmutabilidad de documentos registrando su huella digital criptográfica (**Hash SHA-256**) directamente en la blockchain de **NEAR Protocol (Testnet)**.

## **📁 Estructura del Módulo**

near-protocol/  
├── contracts/  
│   ├── build/                 \# Binarios compilados (.wasm)  
│   │   └── verificador.wasm   \# Ejecutable cargado en la red NEAR  
│   ├── index.js               \# Smart Contract escrito en JS (near-sdk-js)  
│   └── package.json           \# Configuración de dependencias y scripts  
└── frontend/  
    └── index.html             \# Interfaz de usuario (HTML \+ JS con near-api-js)

## **🚀 Guía de Instalación y Despliegue Paso a Paso**

### **🛠️ 1\. Preparación del Entorno**

1. Navega a la carpeta de contratos:  
   cd near-protocol/contracts

2. Instala las dependencias del SDK de NEAR:  
   npm install

3. **Solución de Permisos (si npm bloquea scripts de post-instalación):**  
   Si la terminal no compila la herramienta interna qjsc por bloqueo de permisos, ejecútala manualmente:  
   cd node\_modules/near-sdk-js  
   node lib/cli/post-install.js  
   cd ../..  
   chmod \-R \+x node\_modules/near-sdk-js/

### **🔨 2\. Compilación del Smart Contract**

Compila la lógica escrita en JavaScript a un binario **WebAssembly (.wasm)**:

npm run build

> **Resultado:** Se genera el binario en build/verificador.wasm.

### **🔑 3\. Configuración Manual de Credenciales (Bypass de Firewall / CLI Login)**

Para desplegar directamente desde la terminal sin depender del navegador o para mitigar bloqueos de red:

1. Crea la carpeta de credenciales en la raíz de tu usuario Linux (\~):  
   mkdir \-p \~/.near-credentials/testnet

2. Obtén tus claves desde [MyNearWallet Testnet](https://testnet.mynearwallet.com):  
   * **Public Key:** Obtenida en la sección *Full Access Keys* (ed25519:...).  
   * **Private Key:** Obtenida en la sección *Security & Recovery / View Private Key* (ed25519:...).  
3. Crea y edita el archivo de credenciales de la cuenta:  
   nano \~/.near-credentials/testnet/luinos.testnet.json

4. Agrega la estructura JSON con las llaves de tu cuenta:  
   {  
     "account\_id": "luinos.testnet",  
     "public\_key": "ed25519:AQUI\_TU\_CLAVE\_PUBLICA",  
     "private\_key": "ed25519:AQUI\_TU\_CLAVE\_PRIVADA"  
   }

   *(Guarda con CTRL \+ O, presiona ENTER, y sal con CTRL \+ X).*

### **🚢 4\. Despliegue del Contrato**

Despliega el archivo ejecutable .wasm directamente en tu cuenta de NEAR Testnet:

npx near-cli deploy luinos.testnet build/verificador.wasm

> **Confirmación esperada:**

> Done deploying to luinos.testnet \+ *Transaction ID*.

### **💻 5\. Ejecución del Frontend**

1. Abre el archivo near-protocol/frontend/index.html.  
2. Confirma que la variable del contrato apunte a tu cuenta:  
   const CONTRACT\_ID \= "luinos.testnet";

3. Dirígete a la carpeta del frontend en tu terminal:  
   cd ../frontend

4. **Identificar y liberar el puerto 8000 si está ocupado:**  
   lsof \-i :8000  
   fuser \-k 8000/tcp

5. Inicia un servidor HTTP local con Python:  
   python3 \-m http.server 8000

6. Ingresa en tu navegador a: **http://localhost:8000**

## **🧪 Pruebas del Notario Digital**

1. **Conectar Billetera:** Haz clic en **"1. Conectar NEAR Wallet"** e inicia sesión con la cuenta luinos.testnet.  
2. **Registrar Documento:** Carga un archivo PDF. La app calculará su Hash SHA-256 en cliente y ejecutará la función @call({}) registrar\_documento en la blockchain de NEAR.  
3. **Verificar Documento:** Carga cualquier archivo en la sección de validación para ejecutar una consulta gratuita @view({}) verificar\_documento a los nodos de NEAR, obteniendo la fecha exacta y la cuenta que firmó el registro.
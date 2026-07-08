# Entrega Final — Curso Node.js

API REST desarrollada con **Node.js** y **Express** para que la tienda oficial de un cliente administre su catálogo de productos (leer, crear, actualizar, eliminar), con **autenticación JWT** para proteger las operaciones de escritura y **Firestore** (Firebase) como base de datos en la nube.

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| **Node.js** (v22, ESModules) | Runtime del servidor. El proyecto usa `"type": "module"` y sintaxis `import`/`export` en todo el código. |
| **Express 5** | Framework HTTP: ruteo, middlewares. |
| **cors** | Habilita peticiones de origen cruzado para que los frontends del cliente puedan consumir la API. |
| **body-parser** | Middleware para interpretar el body JSON de las peticiones. |
| **firebase** (SDK de cliente) | Acceso a **Firestore**, base de datos NoSQL en la nube donde se persisten `products` (y `orders`, extra). |
| **jsonwebtoken** | Emisión y verificación de Bearer tokens para proteger las rutas de escritura. |
| **dotenv** | Carga de variables de entorno desde `.env`. |
| **node:crypto** (built-in) | Hashing de la contraseña de login con `scrypt`, sin depender de una librería externa. |
| **open.er-api.com** (extra) | API pública gratuita de tipos de cambio, consumida en `services/exchangeRate.service.js` para el endpoint de conversión de precios. |
| **Vercel** | Hosting serverless donde se despliega la API. |

## Estructura del proyecto

```
memMonoRepo/
└── apps/
    └── api/
        ├── config/
        │   └── firebase.js          # initializeApp (SDK cliente) + getFirestore
        ├── models/                  # Acceso crudo a Firestore (collection/doc/getDocs/addDoc/...)
        │   ├── product.model.js
        │   └── order.model.js       # (extra)
        ├── services/                # Reglas de negocio, llaman a los models
        │   ├── products.service.js
        │   ├── order.service.js     # (extra)
        │   ├── auth.service.js      # valida credenciales + firma JWT
        │   └── exchangeRate.service.js  # (extra) consumo de API externa
        ├── controllers/             # Lógica de request/response por recurso
        ├── middlewares/
        │   ├── asyncHandler.js      # wrapper para no repetir try/catch en controllers async
        │   ├── errorHandler.js      # handler de 404 y de errores centralizado
        │   └── auth.middleware.js   # verifica Bearer JWT (401 / 403)
        ├── routes/                  # Definición de endpoints por recurso
        ├── scripts/
        │   ├── seed.js              # carga productos de ejemplo en Firestore
        │   └── hashPassword.js      # genera el hash para AUTH_PASSWORD_HASH
        ├── utils/
        │   └── apiError.js          # clase de error con status HTTP
        ├── index.js                 # punto de entrada del servidor
        ├── vercel.json               # configuración de deploy en Vercel
        ├── .env.example
        └── package.json             # "type": "module"
```

## Configuración de Firebase / Firestore

El proyecto usa el **SDK de cliente de Firebase** (paquete `firebase`), no el Admin SDK. Como la autenticación de la API es JWT propio (no Firebase Auth), las reglas de Firestore no pueden basarse en `request.auth`: la protección real de las escrituras ocurre en la API (middleware JWT), no en Firestore.

1. Entrar a la [consola de Firebase](https://console.firebase.google.com/) y crear (o usar) un proyecto.
2. Ir a **Compilación → Firestore Database** y crear la base de datos, eligiendo la opción **NoSQL / Firestore** (no "Data Connect" / SQL).
3. Ir a **Configuración del proyecto (ícono de engranaje) → General → Tus apps**, agregar una **app Web** (ícono `</>`) si no hay una, y copiar el objeto `firebaseConfig` que muestra: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
4. En **Firestore Database → Reglas**, pegar (modo de desarrollo, ya que la protección real es JWT en la API):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /products/{productId} { allow read, write: if true; }
       match /orders/{orderId} { allow read, write: if true; }
     }
   }
   ```

## Variables de entorno

Copiar `apps/api/.env.example` a `apps/api/.env` y completar:

```
PORT=3000

FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

AUTH_USERNAME=admin
AUTH_PASSWORD_HASH=
JWT_SECRET=
JWT_EXPIRES_IN=1h
```

- Los seis `FIREBASE_*` salen del `firebaseConfig` del paso anterior.
- `AUTH_PASSWORD_HASH` se genera con el script incluido (ver abajo) — nunca se guarda la contraseña en texto plano.
- `JWT_SECRET` puede ser cualquier string largo y aleatorio.

El archivo `.env` está en `.gitignore` y nunca se commitea.

## Instalación y ejecución

```bash
cd apps/api
npm install

# generar el hash de la contraseña de login y pegarlo en AUTH_PASSWORD_HASH del .env
npm run hash-password -- miPassword123

# cargar productos de ejemplo en Firestore (opcional pero recomendado)
npm run seed

# levantar el servidor
npm run dev     # con auto-reload (node --watch)
# o
npm start
```

El servidor queda disponible en `http://localhost:3000`.

## Autenticación

`POST /auth/login` valida `username`/`password` contra `AUTH_USERNAME`/`AUTH_PASSWORD_HASH` y devuelve un Bearer token (JWT):

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"miPassword123"}'
```

```json
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

Ese token se usa en el header `Authorization` de las rutas protegidas:

```bash
curl -X POST http://localhost:3000/api/products/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{"name":"sillon 4","price":250,"color":"gris"}'
```

## Endpoints

### Health check

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Devuelve `{ "status": "ok" }`. |

### Autenticación

| Método | Ruta | Auth | Body | Descripción |
|---|---|---|---|---|
| POST | `/auth/login` | — | `{ "username": "admin", "password": "..." }` | Devuelve `{ "token": "..." }` si las credenciales son válidas. 401 si no. |

### Productos (`/api/products`)

| Método | Ruta | Auth | Body | Descripción |
|---|---|---|---|---|
| GET | `/api/products` | — | — | Lista todos los productos. |
| GET | `/api/products/:id` | — | — | Obtiene un producto por id. 404 si no existe. |
| GET | `/api/products/:id/price?currency=EUR` | — | — | (Extra) Convierte el precio del producto a la moneda pedida usando la API externa de tipo de cambio. |
| POST | `/api/products/create` | **Bearer** | `{ "name": "sillon", "price": 150, "color": "negro" }` | Crea un producto. |
| PUT | `/api/products/:id` | **Bearer** | `{ "name": "sillon", "price": 180, "color": "negro" }` | (Extra) Actualiza un producto. 404 si no existe. |
| DELETE | `/api/products/:id` | **Bearer** | — | Elimina un producto. 204 si se borró, 404 si no existe. |

### Órdenes (`/api/orders`, extra — no pedido por la consigna)

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/api/orders` | — | Lista todas las órdenes. |
| GET | `/api/orders/:id` | — | Obtiene una orden por id. 404 si no existe. |
| POST | `/api/orders` | `{ "customerId": 1, "items": [{ "productId": "abc123", "quantity": 2 }] }` | Crea una orden, valida productos y calcula totales. |

## Manejo de errores

Todos los controllers son `async` y están envueltos con `asyncHandler`, que reenvía cualquier excepción al middleware central de errores (`middlewares/errorHandler.js`). La respuesta siempre es un único JSON `{ "error": "..." }` con el status HTTP correspondiente:

- **400** — body o parámetros inválidos.
- **401** — falta el header `Authorization` o las credenciales de login son incorrectas.
- **403** — el token JWT presente es inválido o expiró.
- **404** — recurso no encontrado o ruta no definida.
- **500** — error interno no esperado.
- **502** — el servicio externo de tipo de cambio no respondió (extra).

## Despliegue en Vercel

1. Importar el repositorio de GitHub en [vercel.com/new](https://vercel.com/new).
2. **Root Directory** → `apps/api`.
3. **Environment Variables** → cargar las mismas variables que en `.env` local (los seis `FIREBASE_*`, `AUTH_USERNAME`, `AUTH_PASSWORD_HASH`, `JWT_SECRET`, `JWT_EXPIRES_IN`).
4. Deploy. `vercel.json` enruta todo el tráfico a `index.js`, que exporta la app de Express (no llama a `listen()` cuando corre en Vercel).

> Si el proyecto ya estaba desplegado con la versión anterior (Admin SDK), hay que **reemplazar** las variables viejas (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) por las nuevas del SDK de cliente y volver a desplegar.

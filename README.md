# 📒 Gestor de Notas - Prueba Técnica

Aplicación privada para gestionar notas personales, desarrollada con **Vue 3**, **Composition API**, **Quasar Framework**, **Pinia** para manejo de estado y **Webpack** como empaquetador. Consume una **API REST protegida con JWT**, e implementa autenticación real, CRUD de notas, subida de archivos adjuntos y manejo centralizado del estado.


---

## 🚀 Tecnologías utilizadas

- [Vue 3](https://vuejs.org/) con Composition API
- [Quasar Framework](https://quasar.dev/)
- [Pinia](https://pinia.vuejs.org/) para gestión del estado
- [Webpack](https://webpack.js.org/) como empaquetador
- [Axios](https://axios-http.com/) para consumo de API
- [JWT](https://jwt.io/) para autenticación

---

✅ Funcionalidades principales
🔐 Login real con JWT

💾 Manejo de sesión persistente

📝 CRUD completo de notas (crear, leer, editar, eliminar)

📎 Adjuntar archivos a notas (Faltante)

🧠 Gestión del estado con Pinia

🔄 Comunicación con API real protegida (según OpenAPI provisto)

✍️ Edición en línea de notas con doble clic

🔍 Filtros por texto, fecha u otras propiedades

📄 Vista previa de archivos adjuntos (faltante)

📅 Agrupación o separación por fechas/categorías (faltante) - API para getAll, donde las notas solo da noteCode, NoteText

📱 Diseño responsive para móviles


↕️ Ordenamiento por campos clave (título, fecha, etc.) - Ordenamiento usando el noteCode

a Note pad project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).




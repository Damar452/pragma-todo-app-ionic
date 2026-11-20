# Todo App (Ionic + Angular + Cordova)

Aplicación de tareas con persistencia local para Android, construida con Ionic, Angular y Cordova. Permite crear, completar y eliminar tareas, organizarlas con **categorías** (crear, editar, eliminar, asignar y filtrar) y activar o desactivar la función de categorías en caliente mediante un **feature flag de Firebase Remote Config**. Prueba técnica para Pragma.

## Evidencias

> 📦 **Entregables listos para evaluar** en la carpeta [`Evidencias de funcionamiento/`](Evidencias%20de%20funcionamiento/):

| Archivo                                                                                             | Qué es                                                                                                                           |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [`app-debug.apk`](Evidencias%20de%20funcionamiento/app-debug.apk)                                   | APK de la app para instalar en un dispositivo o emulador Android (`adb install -r "Evidencias de funcionamiento/app-debug.apk"`) |
| [`Video de prueba tecnica.mp4`](Evidencias%20de%20funcionamiento/Video%20de%20prueba%20tecnica.mp4) | Video demostrativo del funcionamiento de la app y del feature flag que muestra u oculta el módulo de Categorías                  |

## Índice

| Tema                    | Dónde verlo                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| Cómo correrla           | [Inicio rápido](#inicio-rápido)                                      |
| Generar el APK          | [Generar el APK](#generar-el-apk)                                    |
| Demo del feature flag   | [Firebase Remote Config](#firebase-remote-config-y-feature-flag)     |
| Qué se hizo y cuándo    | [Descripción de los cambios](#descripción-de-los-cambios-realizados) |
| Arquitectura en detalle | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                         |

## Inicio rápido

Requisitos previos en [Stack y versiones](#stack-y-versiones).

```bash
npm ci                    # instala dependencias (Ionic CLI y Cordova son locales)
npm start                 # navegador en http://localhost:4200
npm test                  # tests unitarios
npm run android:build     # genera el APK debug
npm run android:run       # compila e instala en el dispositivo o emulador conectado
```

APK resultante: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`.

## Funcionalidades

### Tareas

- Crear, completar (checkbox) y eliminar tareas, con persistencia local que sobrevive al cierre de la app.
- Editar una tarea tocándola.
- Orden automático: pendientes primero y, dentro de cada grupo, las más recientes arriba.
- Pantalla "Hoy" con una **tarjeta de progreso** (anillo y mensaje que cambia según el avance: "Planifica tu día", "¡Empecemos!", "¡Sigue así!", "¡Ya casi terminas!", "¡Todo listo por hoy!").
- **Deshacer** al eliminar una tarea (toast con acción "Deshacer").

### Categorías (nueva funcionalidad)

- Crear, editar y eliminar categorías con nombre y color.
- Asignar una categoría a cada tarea desde el formulario; la tarea muestra su etiqueta de color.
- **Filtrar** tareas por categoría con chips (incluye "Todas" y "Sin categoría").
- Validación de nombre duplicado **sin distinguir mayúsculas ni tildes** ("Trabajo" = "trabajo" = "TRABAJO").
- Al eliminar una categoría se pide **confirmación** (indica cuántas tareas quedarán sin categoría) y esas tareas se **desasignan**, sin borrarse.
- Cada categoría muestra su cantidad de tareas y un **anillo de progreso**.

### UX y marca

- Acciones **visibles**: botón `⋮` en cada elemento y, además, **deslizar** (deslizar a la derecha para completar; a la izquierda para editar o eliminar).
- Modo oscuro automático según el sistema.
- Ícono y splash propios para Android, con tipografía Lexend Deca incluida en la app (funciona sin conexión).
- Interfaz en español (i18n con Transloco y plurales ICU).
- Mensajes de confirmación y de error mediante toasts.

### Feature flag remoto

El feature flag está enfocado en **mostrar u ocultar el módulo de Categorías**: el flag `categories_enabled` de Firebase Remote Config lo activa o desactiva por completo, sin reinstalar ni recargar la app. Ver [la sección dedicada](#firebase-remote-config-y-feature-flag).

## Stack y versiones

Versiones instaladas (verificadas en `node_modules` / `package-lock.json`):

| Paquete                   | Versión |
| ------------------------- | ------- |
| Angular (`@angular/core`) | 22.2.6  |
| Angular CLI               | 22.2.7  |
| Ionic (`@ionic/angular`)  | 9.0.13  |
| Ionic CLI (`@ionic/cli`)  | 7.2.1   |
| Cordova                   | 13.0.0  |
| `cordova-android`         | 15.1.0  |
| `@ionic/cordova-builders` | 13.0.0  |
| TypeScript                | 6.0.3   |
| Vitest                    | 5.1.1   |
| Firebase (SDK web)        | 13.4.0  |
| `@jsverse/transloco`      | 8.4.0   |
| `@ionic/storage-angular`  | 4.0.0   |
| `cordova-sqlite-storage`  | 7.0.0   |

### Requisitos del entorno

| Herramienta | Requisito                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| Node.js     | **≥ 24.15** (Angular CLI 22 acepta `^22.22.3`, `^24.15.0` o `>=26`; con 24.13 se niega a ejecutarse) |
| JDK         | **17**                                                                                               |
| Android SDK | Platform **36** y build-tools **36** (`cordova-android` 15 usa API 36 y mínimo API 24)               |
| Gradle      | Instalado en el sistema (`brew install gradle`); `cordova-android` lo necesita                       |
| Dispositivo | Emulador (AVD) o teléfono con depuración USB activada                                                |

Ionic CLI y Cordova son `devDependencies` locales: **no hace falta instalarlos globalmente**, se usan mediante los scripts de npm o `npx`.

## Instalación

1. Instala Node 24 (si tu Node es más antiguo, con Homebrew):

   ```bash
   brew install node@24
   export PATH="/opt/homebrew/opt/node@24/bin:$PATH"   # añádelo a tu shell para que persista
   node -v                                              # debe ser >= 24.15
   ```

2. Instala JDK 17 y Gradle (`brew install openjdk@17 gradle`) y el Android SDK (Android Studio) con Platform 36 y build-tools 36. Define `ANDROID_HOME` y `JAVA_HOME`.
3. Clona el repositorio e instala dependencias:

   ```bash
   git clone <url-del-repositorio>
   cd pragma-todo-app-ionic
   npm ci
   ```

4. Si no existe la carpeta `platforms/android`, agrégala:

   ```bash
   npx cordova platform add android
   ```

5. Verifica en el navegador con `npm start` (abre `http://localhost:4200`).

## Comandos de desarrollo

| Comando                   | Qué hace                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| `npm start`               | Servidor de desarrollo en el navegador (`ng serve`)                       |
| `npm run build`           | Build de producción de la parte web en `www/`                             |
| `npm run watch`           | Build en modo desarrollo con recompilación automática                     |
| `npm test`                | Tests unitarios con Vitest, una sola ejecución                            |
| `npm run test:unit:watch` | Tests unitarios en modo watch (`npm run test:unit` equivale a `npm test`) |
| `npm run test:e2e`        | Tests end-to-end con Playwright                                           |
| `npm run lint`            | ESLint (incluye reglas de capas) + typecheck de e2e + chequeo de Prettier |
| `npm run lint:fix`        | Corrige lo que ESLint y Prettier puedan arreglar solos                    |
| `npm run android:build`   | `ionic cordova build android`: genera el APK debug                        |
| `npm run android:run`     | `ionic cordova run android`: compila e instala en el dispositivo/emulador |
| `npm run android:emulate` | `ionic cordova emulate android`: compila y ejecuta en un emulador         |
| `npm run android:live`    | Live reload en Android (ver [más abajo](#live-reload-en-android))         |
| `npm run assets:icons`    | Regenera los íconos PNG y el favicon desde `resources/brand/icon.svg`     |

## Generar el APK

> **¿Solo quieres probar la app?** El APK ya generado está en [`Evidencias de funcionamiento/app-debug.apk`](Evidencias%20de%20funcionamiento/app-debug.apk). Para generarlo tú mismo:

```bash
npm run android:build
```

El build de Ionic usa la configuración de producción de Angular por defecto. El resultado queda en:

```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Para instalarlo:

```bash
adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk
# o, con un dispositivo/emulador conectado:
npm run android:run
```

- Es un APK **debug**, firmado con la clave de depuración de Android: sirve para evaluación e instalación directa.
- **No hay configuración de release** (no existe `build.json` ni keystore). Para un release habría que crear un keystore y ejecutar `npx ionic cordova build android --prod --release` con la firma configurada; no se ha hecho ni probado en este proyecto.

## Live reload en Android

`ionic cordova run android -l` no funciona con el builder esbuild de Angular, así que el proyecto incluye `scripts/android-livereload.mjs`:

```bash
npm run android:build                         # una vez, para crear platform_www
npm run android:live                          # primer dispositivo o emulador encendido
npm run android:live -- --emulator            # o --device, o --target <id>
npm run android:live -- --host 192.168.1.20   # forzar IP (o variable LIVERELOAD_HOST)
```

- Levanta `ng serve` en `0.0.0.0:8100` y parchea temporalmente `config.xml` para que la app cargue ese servidor; al terminar con Ctrl+C lo restaura.
- El teléfono debe estar en **la misma red Wi-Fi** que el computador.
- macOS puede pedir **permiso de firewall** para Node la primera vez.
- Después, ejecuta `npm run android:run` para **reinstalar** la app empaquetada: la instalada sigue apuntando al servidor de desarrollo.

Detalle del mecanismo: [docs/ARCHITECTURE.md → Live reload en Android](docs/ARCHITECTURE.md#flujo-de-desarrollo-live-reload-en-android).

## Firebase Remote Config y feature flag

### Qué controla

El feature flag está enfocado en **mostrar u ocultar el módulo de Categorías**. Es el flag booleano **`categories_enabled`** (valor local por defecto: `true`):

- **`true`**: el módulo de Categorías está disponible (pestaña, gestión de categorías, asignación y filtro).
- **`false`**: el módulo de Categorías se oculta por completo y la app funciona como una lista de tareas simple.

Cuando está en `false`:

- desaparece la pestaña "Categorías" y la ruta redirige a tareas;
- la lista de tareas oculta los chips de filtro, el campo de categoría del formulario y la etiqueta en las tarjetas.

Los datos **nunca se borran**: al volver a `true` todo reaparece.

### Cuándo se actualiza

| Camino             | Cómo funciona                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Arranque           | Se consulta Remote Config con un tope de **2 s**; si tarda más, la app inicia con valores en caché o por defecto y se actualiza al terminar |
| Tiempo real        | `onConfigUpdate`: al publicar en la consola, la app abierta se actualiza en segundos                                                        |
| Al volver a la app | Al reanudarse (`resume`) se vuelve a consultar                                                                                              |

Intervalo mínimo de fetch (`src/environments/`): **0 ms en desarrollo** y **60 s en producción** (el valor por defecto del SDK es 12 h; no conviene bajarlo mucho más por el throttling del backend).

### Demo paso a paso

1. Abre la app (navegador o dispositivo) y verifica que la pestaña **Categorías** y los chips de filtro están visibles.
2. Entra a la [consola de Firebase](https://console.firebase.google.com/) → proyecto → **Remote Config**.
3. Edita el parámetro `categories_enabled` y ponlo en `false`.
4. Pulsa **Publicar cambios** (Publish changes).
5. Sin recargar, la pestaña y los chips desaparecen.
6. Vuelve a `true` y publica: todo reaparece y los datos siguen intactos.

### Usar otro proyecto de Firebase

1. Crea una app web en tu proyecto de Firebase y copia su configuración.
2. Reemplaza los valores de `FIREBASE_OPTIONS` en `src/environments/firebase.config.ts` (son identificadores públicos, no secretos).
3. Crea en Remote Config el parámetro `categories_enabled` (booleano).
4. Si restringes la API key por HTTP referrer, permite `https://localhost/*` (origen del WebView de Cordova).

### Por qué el SDK web y no un plugin nativo

La app corre dentro del WebView de Cordova (origen `https://localhost`), así que el SDK web de Firebase funciona sin cambios. `cordova-plugin-firebasex` habría añadido una dependencia nativa, un `google-services.json` y cambios de Gradle y de plataforma solo para leer un booleano.

## Arquitectura

Organización **por funcionalidad** con una arquitectura **hexagonal liviana** por feature y **Atomic Design** para la UI. Stores y servicios son clases abstractas que actúan como contrato y token de DI; las dependencias entre capas las hace cumplir ESLint (`eslint-plugin-boundaries`).

```
src/app/
├── core/       Puertos y adaptadores globales (storage, feature flags, fechas, feedback, i18n)
├── layout/     Shell con tabs
├── shared/     UI compartida (atoms, molecules, templates) y utilidades
└── features/
    ├── tasks/       domain · data · state · ui
    └── categories/  domain · data · state · ui
```

Detalle completo (reglas de capas, contratos, datos y estado, feature flags, i18n): [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Calidad

- **306 tests unitarios** en 66 archivos (`npm test`, Vitest + jsdom).
- Cobertura por capas: reglas de dominio puras (escritas con TDD), stores contra repositorios en memoria, adaptadores de storage y feature flags (con fakes), y componentes.
- `npm run lint` verifica:
  - reglas de capas (`eslint-plugin-boundaries`);
  - prohibición de imports `../` (se usan alias: `@core`, `@shared`, `@features`, `@layout`, `@testing`, `@assets`, `@env`);
  - reglas de Angular (templates y accesibilidad) y formato con Prettier.
- Convenciones de código (detalle en [ARCHITECTURE.md](docs/ARCHITECTURE.md#convenciones-de-código)):
  - sin strings ni números mágicos en clases (archivos `*.constants.ts`);
  - enums y modelos en `*.enums.ts` / `*.models.ts`, nunca en componentes;
  - helpers globales de una función por archivo con spec;
  - sin `switch/case`: tablas de búsqueda o arreglos de reglas.
- `npm run test:e2e` ejecuta Playwright; el único test e2e actual es el de plantilla de Ionic y no cubre la app.

## Descripción de los cambios realizados

Historial real del repositorio, en orden cronológico:

| Etapa                  | Commit               | Qué se hizo                                                                                                                                      |
| ---------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fundaciones            | `c077cb1`, `8f3712f` | Repositorio inicial y scaffolding de Ionic + Angular + Cordova (Android)                                                                         |
| Marca                  | `2fba50e`            | Nuevo splash e ícono                                                                                                                             |
| UI, marca e i18n       | `70e14d6`            | Estilo de marca, tokens de diseño, componentes de Atomic Design, textos en español con Transloco, ícono y splash alineados con la paleta         |
| Arquitectura           | `4822ca5`            | Estructura por features, capas y reglas de límites con ESLint                                                                                    |
| Convenciones           | `a2e3a7a`            | Constantes, enums, utilidades compartidas y eliminación de `switch/case`                                                                         |
| Lógica y persistencia  | `e12ae52`            | Tareas y categorías con persistencia local (SQLite con respaldo IndexedDB), migraciones de esquema y acciones visibles (`⋮`) además del deslizar |
| Live reload            | `baaeb6e`            | Script de live reload para Cordova en Android                                                                                                    |
| Refactor de fechas     | `9d1b0f2`            | `DateService` centraliza el manejo de fecha y hora                                                                                               |
| Refactor de imports    | `bc98cc7`            | Path aliases en lugar de imports relativos al padre                                                                                              |
| Refactor de contratos  | `86e269b`            | Stores y servicios dependen de contratos abstractos (inversión de dependencias)                                                                  |
| Firebase Remote Config | `8ce02f6`            | Integración de Remote Config y feature flag `categories_enabled` que controla toda la función de categorías                                      |

Ver el historial completo con `git log --oneline`.

## Decisiones y trade-offs

- **SDK web de Firebase vs plugin nativo:** menos superficie nativa y sin cambios en Gradle, a cambio de depender de que el WebView soporte el SDK (si no, la app usa los valores por defecto).
- **Almacenamiento:** SQLite nativo en el dispositivo (`cordova-sqlite-storage`) con respaldo a IndexedDB y localStorage en el navegador, todo detrás del contrato `KeyValueStorage`.
- **Signals en lugar de NgRx:** el estado es pequeño (dos stores); los signals bastan y evitan boilerplate.
- **Migraciones de esquema:** versión guardada en `todo:schemaVersion`; las migraciones antiguas no se editan, solo se agregan nuevas.
- **Intervalo de fetch de 1 min en producción:** permite que la demo refleje cambios rápido; en un release real debería subirse.
- **Splash:** el fondo del splash es claro (`#F7F6FD`) también en modo oscuro, porque se define una sola vez en `config.xml`.
- **Live reload propio:** necesario porque `ionic cordova run -l` es incompatible con el builder esbuild.

## Solución de problemas

| Problema                                            | Causa y solución                                                                                                                                                  |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular CLI se niega a ejecutarse (versión de Node) | Node demasiado antiguo (p. ej. 24.13). Instala `node@24` con Homebrew y revisa `node -v` (≥ 24.15).                                                               |
| `npm` falla por permisos en `~/.npm`                | La caché quedó con dueño `root`. Ejecuta `sudo chown -R <tu-usuario> ~/.npm` indicando tu usuario de forma explícita (no `$(whoami)` dentro de un shell de root). |
| `ERR_NO_TARGET` al ejecutar en Android              | No hay dispositivo ni emulador. Inicia uno antes (`emulator -avd <nombre>`) o conecta el teléfono y comprueba con `adb devices`.                                  |
| El emulador no arranca por espacio en disco         | Libera espacio en disco; el AVD necesita espacio suficiente para iniciar.                                                                                         |
| `ionic cordova run android -l` falla                | Es incompatible con el builder esbuild. Usa `npm run android:live`.                                                                                               |

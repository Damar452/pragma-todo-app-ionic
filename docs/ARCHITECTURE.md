# Arquitectura

La app se organiza **por funcionalidad** (el árbol de carpetas dice "tasks" y "categories", no "services" y "components"), con una separación **hexagonal liviana** dentro de cada feature y **Atomic Design** para la UI. Las reglas de capas de este documento las hace cumplir `eslint-plugin-boundaries` (ver `eslint.config.js`): un import incorrecto hace fallar `npm run lint`.

## Contenido

- [Estructura de carpetas](#estructura-de-carpetas)
- [Reglas de capas](#reglas-de-capas)
- [Convenciones de código](#convenciones-de-código)
- [Path aliases](#path-aliases)
- [Datos y estado](#datos-y-estado)
- [Contratos e inversión de dependencias](#contratos-e-inversión-de-dependencias)
- [Feature flags](#feature-flags)
- [Lenguaje visual](#lenguaje-visual)
- [Internacionalización](#internacionalización)
- [Flujo de desarrollo: live reload en Android](#flujo-de-desarrollo-live-reload-en-android)

## Estructura de carpetas

```
src/app/
├── core/                      Singletons y puertos/adaptadores de la app (storage, feedback, runtime, feature flags, plataforma)
├── layout/                    Shell de la app (layout con tabs) alrededor de las features enrutadas
├── shared/
│   ├── ui/
│   │   ├── atoms/             Piezas de UI mínimas, sin dominio (color-dot, progress-ring, icon-badge, status-pill)
│   │   ├── molecules/         Composiciones de atoms (chip-selector, progress-summary, section-header, empty-state)
│   │   └── templates/         Layouts de página con proyección de contenido
│   └── utils/<tema>/          Funciones auxiliares globales, una por archivo (number/clamp.ts, date/format-long-date.ts, ...)
└── features/
    └── <feature>/
        ├── domain/            Modelos y reglas de negocio puras. Sin Angular.
        ├── data/              Repositorios: persistencia detrás de un contrato abstracto
        ├── state/             Stores basados en signals
        ├── ui/
        │   ├── organisms/     Componentes presentacionales con conocimiento del dominio
        │   └── pages/         Contenedores enrutados: la única UI que inyecta estado
        └── <feature>.routes.ts
```

Las carpetas se crean cuando el primer archivo las necesita; no se mantienen capas vacías.

## Reglas de capas

| Desde       | Puede importar                                                              |
| ----------- | --------------------------------------------------------------------------- |
| `core`      | core, shared/utils                                                          |
| `layout`    | core, atoms, molecules, templates, shared/utils                             |
| `atoms`     | atoms, shared/utils                                                         |
| `molecules` | atoms, molecules, shared/utils                                              |
| `templates` | atoms, molecules, templates, shared/utils                                   |
| `domain`    | el `domain` de su propia feature, shared/utils                              |
| `data`      | `domain` y `data` de su propia feature, core, shared/utils                  |
| `state`     | `domain`, `data` y `state` de su propia feature, core, shared/utils         |
| `organisms` | `domain` (de cualquier feature), atoms, molecules, organisms propios, utils |
| `pages`     | todo lo anterior, excepto los organisms de otras features                   |

Todo lo que no figura en la tabla es un error de lint.

Ideas clave detrás de las reglas:

- **`shared` nunca importa `features`.** La UI compartida no conoce el dominio y es reutilizable.
- **Los componentes de Ionic son los bloques de los atoms.** No se envuelve `ion-button` en un `app-button` que solo reenvía inputs.
- **Container / presentational.** Las pages inyectan stores; desde atoms hasta organisms solo usan `input()` / `output()` con `OnPush`.
- **El dominio es puro.** Las reglas de negocio son funciones simples, testeables sin TestBed.

## Convenciones de código

1. **Sin strings ni números mágicos en las clases.** Componentes, pages, services y stores los toman de un archivo `<nombre>.constants.ts` en la carpeta del dueño (`UPPER_SNAKE_CASE`, `as const` cuando aporte). Los bindings numéricos o de configuración del template (`[size]`, `[breakpoints]`) salen de una propiedad del componente alimentada por esas constantes. Solo quedan en línea los metadatos de Angular, las rutas de import, el SCSS y los atributos de markup puro (`slot="start"`, `fill="clear"`).
2. **Enums, tipos, interfaces y clases nunca viven en un archivo de componente o page.** Los valores tipo enum son un objeto `as const` más un tipo unión derivado en `<nombre>.enums.ts`; las interfaces y tipos van en `<nombre>.models.ts` junto al dueño. Los modelos de dominio se quedan en `domain/`.
3. **Los helpers transversales son funciones globales**, una por archivo, en `shared/utils/<tema>/<nombre-fn>.ts`, cada una con su spec. La lógica pura específica de una feature (filtrar tareas, contar estadísticas) vive en el `domain/` de esa feature como funciones puras con spec; las pages solo las llaman dentro de `computed()`.
4. **Sin `switch/case`.** Se usan tablas de búsqueda indexadas por los valores del enum (`TaskFilterHandlers` + `matchTaskFilter`), `Map`s o arreglos ordenados de reglas (`progress-summary.headline.ts`).

Nombres de archivo: `*.constants.ts`, `*.enums.ts`, `*.models.ts`, `shared/utils/<tema>/<fn>.ts` (más `<fn>.spec.ts`).

## Path aliases

Los alias de TypeScript (`paths` en `tsconfig.json`) reemplazan todos los imports relativos al padre:

| Alias         | Apunta a             |
| ------------- | -------------------- |
| `@core/*`     | `src/app/core/*`     |
| `@shared/*`   | `src/app/shared/*`   |
| `@features/*` | `src/app/features/*` |
| `@layout/*`   | `src/app/layout/*`   |
| `@testing/*`  | `src/testing/*`      |
| `@assets/*`   | `src/assets/*`       |
| `@env/*`      | `src/environments/*` |

Los imports `../` están prohibidos (`no-restricted-imports` hace fallar el lint). Solo los imports de la misma carpeta (`./x`) se mantienen relativos: son los vecinos inmediatos del archivo.

## Datos y estado

### Almacenamiento

Los repositorios dependen del contrato abstracto `KeyValueStorage` (`core/storage`). `IonicStorageAdapter` lo implementa con `@ionic/storage-angular` (la v4 es solo NgModule, por eso `provideStorage()` usa `importProvidersFrom(IonicStorageModule.forRoot(...))`).

Orden de drivers:

1. `cordovaSQLiteDriver`: SQLite nativo mediante `cordova-sqlite-storage` (en el dispositivo).
2. IndexedDB.
3. localStorage (navegador).

El driver de SQLite se registra con `defineDriver()` antes de `create()`; ambos se ejecutan una sola vez, de forma diferida, detrás de una promesa memoizada en la primera lectura o escritura. Los specs usan `InMemoryKeyValueStorage` (`core/storage/testing/`).

### Claves y migraciones

| Clave                | Contenido                      | Definida en                         |
| -------------------- | ------------------------------ | ----------------------------------- |
| `todo:tasks`         | Arreglo completo de tareas     | `data/` de la feature (constantes)  |
| `todo:categories`    | Arreglo completo de categorías | `data/` de la feature (constantes)  |
| `todo:schemaVersion` | Versión del esquema almacenado | `core/storage/storage.constants.ts` |

- Los repositorios parsean de forma defensiva (`parseTasks` / `parseCategories`): los datos ilegibles se leen como `[]` y los elementos inválidos se descartan.
- `runMigrations(storage, migrations)` (`core/storage`) lee la versión guardada (si falta, 0), aplica en orden cada migración más nueva y guarda la versión después de cada una.
- El historial vive en `src/app/app.migrations.ts` (raíz de la app, porque abarca las claves de ambas features y el `data/` de una feature no puede hacerlo). Versión actual: **2** (la v2 asigna `categoryId: null` a las tareas legadas e inicializa la clave de categorías en `[]`).
- **Nunca se edita una migración antigua**: se agrega una nueva.

### Stores

`TasksStore` y `CategoriesStore` son la única fuente de verdad, con signals de solo lectura (`status`, `tasks` / `categories` ordenadas). Cada mutación sigue el mismo flujo:

1. Una función pura del dominio calcula la lista siguiente.
2. Se actualiza el signal (actualización optimista).
3. El repositorio persiste la lista.
4. Si falla, se restaura la lista anterior y se relanza el error (las pages muestran un toast de error).

Detalles:

- `TasksStore.remove()` devuelve un snapshot `{ task, index }` para `restore()` (deshacer).
- `CategoriesStore.remove()` además llama a `CategoryTaskCleanup.unassignCategory()` (ver [contratos](#contratos-e-inversión-de-dependencias)).
- Los ids vienen del token `ID_GENERATOR` (`core/runtime`) y el tiempo de `DateService`, así los specs son deterministas.

### Inicialización de la app

`app.config.ts` es la raíz de composición (los providers salieron de `main.ts`). `provideAppInitializer(initializeAppData)` ejecuta las migraciones y luego `Promise.all([tasks.load(), categories.load()])` antes del primer render. Mientras tanto, el splash nativo (`AutoHideSplashScreen=false`) permanece visible.

### Fechas y tiempo

`DateService` (`core/date`) es el único punto de entrada: `now()` (epoch en ms), `today()` y `formatLongDate(date)` (con la primera letra en mayúscula, según el `LOCALE_ID` de la app). Delega en los helpers puros de `shared/utils`. Stores y pages nunca llaman a `Date.now()`, `new Date()` ni `Intl` directamente; los specs usan `provideFakeDate(now?)` (`core/date/testing/`).

### Feedback al usuario

`FeedbackService` (`core/feedback`, implementado por `IonicFeedbackService`) envuelve los toasts y alerts de Ionic con claves de Transloco:

| Método          | Uso                                                     |
| --------------- | ------------------------------------------------------- |
| `toast`         | Mensaje informativo                                     |
| `toastError`    | Mensaje de error                                        |
| `toastWithUndo` | Toast con acción "Deshacer"; resuelve `true` si se tocó |
| `confirm`       | Diálogo de confirmación                                 |

## Contratos e inversión de dependencias

Stores y services son **clases abstractas** que hacen de contrato y de token de DI a la vez. Los consumidores inyectan el contrato; las implementaciones se enlazan en funciones `provide*()`.

- **Nombres.** El contrato conserva el nombre de dominio (`TasksStore`, `CategoriesStore`, `FeedbackService`, `DateService`) para que los consumidores no cambien. La implementación dice cómo funciona: `Signal*` (`SignalTasksStore`, `SignalCategoriesStore`), `Ionic*` (`IonicFeedbackService`), `Intl*` (`IntlDateService`). Misma idea que `TaskRepository` / `TaskLocalRepository`.
- **Enlaces (bindings).** Viven en `provideTasksState()`, `provideCategoriesState()`, `provideFeedback()`, `provideDate()` (más los de data y storage), todos registrados en `app.config.ts`. Las implementaciones son `@Injectable()` simples (sin `providedIn: 'root'`): nada se resuelve si no está enlazado. Los stores usan `useExisting` para que una sola instancia responda tanto al contrato como a la clase concreta; los services sin consumidores de la clase concreta usan `useClass`.
- **Contratos estrechos entre features (ISP).** El estado de categorías necesita una sola cosa de tareas: desasignar una categoría eliminada. Declara `CategoryTaskCleanup` (`unassignCategory`) en su propia carpeta y `SignalCategoriesStore` inyecta ese contrato, de modo que `categories/state` no importa nada de la feature de tareas. La raíz de la app lo conecta en `provideCategoryTaskCleanup()`, cuya factory tiene el tipo de retorno anotado como `CategoryTaskCleanup`: si `TasksStore` se desvía del contrato, el build falla ahí.
- **Tests.** Los specs de stores siguen usando el store real con repositorios en memoria (`provideInMemoryTasks()` / `provideInMemoryCategories()` también enlazan los contratos de estado). `FakeFeedbackService` y `FakeDateService` extienden los contratos (`provideFakeFeedback()`, `provideFakeDate()`); `FakeCategoryTaskCleanup` aísla el spec del store de categorías. Los specs de pages que necesitan el cableado real proveen `{ provide: CategoryTaskCleanup, useExisting: TasksStore }`.

Siguen con `providedIn: 'root'` solo `ID_GENERATOR` (un token con valor por defecto) y `TranslocoHttpLoader` (clase de un tercero, sin necesidad de contrato).

## Feature flags

Los flags provienen de **Firebase Remote Config** a través del **SDK web de Firebase** (JS), solo con imports modulares (`firebase/app`, `firebase/remote-config`). La app corre en el WebView de Cordova (origen `https://localhost`), por lo que el SDK web funciona tal cual.

> **Decisión:** se descartó `cordova-plugin-firebasex`. Para un flag booleano agregaría una dependencia nativa, un `google-services.json` y cambios en Gradle (además de tocar `config.xml` y los archivos de plataforma).

### Capas

```
FeatureFlagPort                (contrato; isEnabled(key) devuelve un signal)
  ← FirebaseFeatureFlagAdapter (signals, nunca lanza)
      ← RemoteConfigClient     (costura abstracta delgada)
          ← FirebaseRemoteConfigClient  (único archivo que toca el SDK; inicializa la app de Firebase una vez, de forma diferida)
```

Los specs usan `FakeRemoteConfigClient` para el adapter y `provideFakeFeatureFlags(overrides?)` para todo lo demás (registrado globalmente en `src/test-setup.ts`).

### Claves y valores por defecto

`FeatureFlag` (`feature-flags.enums.ts`) nombra los flags y `FEATURE_FLAG_DEFAULTS` guarda el valor local por defecto de cada uno. Los signals arrancan con esos valores y solo cambian tras un fetch exitoso; por eso, sin conexión o con el SDK no soportado, la app se comporta con los valores por defecto (o con los que el SDK dejó en caché en IndexedDB).

### Cableado

`provideFeatureFlags(environment)` en `app.config.ts` enlaza el puerto y el cliente, y registra `initializeFeatureFlags`, que hace competir `init()` contra `initTimeoutMs` (2 s): el primer render nunca espera más que eso y los signals se actualizan cuando termina el fetch. La configuración (`firebase` + `remoteConfig`) vive en `src/environments/` (`@env/*`); los valores de la configuración web son identificadores públicos.

### Rutas de actualización

| Ruta               | Mecanismo                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Arranque           | `init()` con tope de `initTimeoutMs` (2 s)                                                              |
| Tiempo real        | `onConfigUpdate`: cada push llama a `activate()` y sincroniza los signals, sin reiniciar la app         |
| Al volver a la app | `Platform.resume` dispara `refresh()`; es el respaldo cuando el stream de tiempo real no está conectado |

### Intervalo de fetch

`minimumFetchIntervalMillis`: **dev `0`**, **prod `60_000`** (1 minuto), para que una demo refleje los cambios rápido. El valor por defecto del SDK es 12 h; si se consulta más de unas pocas veces por hora, el backend aplica throttling (el SDK entonces sirve valores en caché). En un release real conviene subir este valor.

### Qué controla `categories_enabled`

- La ruta usa `canMatch: [featureFlagGuard(...)]` (redirige a `/tasks`).
- El layout de tabs oculta la pestaña y sale de `/categories` si el flag se apaga.
- La lista de tareas oculta los chips de filtro (el filtro vuelve a "todas"), el campo de categoría del formulario y la etiqueta en las tarjetas.
- **Los datos nunca se tocan**: al volver a encender el flag se restaura todo.

### Cómo cambiarlo en la demo

1. Firebase console → Remote Config → `categories_enabled` → poner `false`.
2. **Publish changes**.
3. Las apps abiertas se actualizan en segundos (tiempo real); si no, en el próximo arranque o resume posterior al intervalo de fetch.

Si la API key está restringida por HTTP referrer, hay que permitir `https://localhost/*`.

## Lenguaje visual

Los design tokens viven en `src/theme/variables.scss` como CSS custom properties (`--app-*` para la app, `--ion-*` mapeadas sobre Ionic), con un set claro y uno oscuro. Los componentes consumen los tokens (`--app-surface`, `--app-radius-lg`, ...) y nunca fijan colores a mano. La tipografía (Lexend Deca) está alojada localmente mediante `@fontsource-variable/lexend-deca`, así que funciona sin conexión.

El modo oscuro sigue la preferencia del sistema (`@ionic/angular/css/palettes/dark.system.css` más el bloque `prefers-color-scheme: dark` de `variables.scss`).

### Modales tipo sheet

Los modales de formulario usan `class="auto-sheet"` con breakpoints `[0, 1]` y breakpoint inicial `1` (la page los expone desde su `*.page.constants.ts`). Las reglas de `src/global.scss` (`--height: auto`, `.ion-page` relativo) hacen que el sheet se ajuste a su contenido.

> **Importante:** el contenido va directamente en el modal (sin `ion-content`); de lo contrario la altura colapsa.

## Internacionalización

Todo el texto visible para el usuario vive en `src/assets/i18n/<idioma>.json` (hoy solo `es.json`), se sirve como asset y lo carga por HTTP `TranslocoHttpLoader` (`src/app/core/i18n/`). La URL es relativa (`assets/i18n/es.json`), así que también se resuelve dentro del WebView de Cordova.

`provideI18n()` (llamada en `main.ts`) configura Transloco, los plurales ICU (`@jsverse/transloco-messageformat`), `LOCALE_ID` y un app initializer que precarga el idioma por defecto, de modo que el primer render nunca muestra claves sin traducir.

- **Claves** anidadas por área: `app.*` (tabs), `shared.*` (texto de las molecules compartidas), `tasks.*` y `categories.*` (pages, organisms, `form.*`, y `actions.*` para etiquetas y aria), más `feedback.*` (acciones comunes y error genérico).
- **Los atoms se alimentan por input**: reciben el texto ya traducido. Las molecules con texto intrínseco (resumen de progreso, selector de color) usan `shared.*`; organisms y pages usan las claves de su feature.
- **Templates** usan `| transloco` (con parámetros: `'key' | transloco: { count }`); el código de componentes usa `translateSignal(key, params)`. Los plurales usan ICU: `{count, plural, =0 {...} one {# ...} other {# ...}}`.
- **Specs** reciben el `es.json` real mediante `provideTranslocoTesting()` (`src/testing/`), registrado globalmente en `src/test-setup.ts`, así que las aserciones verifican el texto en español que ve el usuario.

Para agregar un idioma (p. ej. `en`): crear `src/assets/i18n/en.json` con las mismas claves, añadir `'en'` a `AVAILABLE_LANGS` en `provide-i18n.ts` y registrar los datos de locale de Angular. No hay que tocar componentes.

## Flujo de desarrollo: live reload en Android

```bash
npm run android:build                         # una vez: crea platforms/android/platform_www (cordova.js + plugins)
npm run android:live                          # primer dispositivo o emulador encendido
npm run android:live -- --emulator            # o --device, o --target <id>
npm run android:live -- --host 192.168.1.20   # fuerza el host (o la variable LIVERELOAD_HOST)
```

`ionic cordova run android -l` no funciona en este proyecto: inyecta `cordova.js` con transformaciones de Webpack, que el builder esbuild `@angular/build:application` rechaza. `scripts/android-livereload.mjs` lo reemplaza así:

1. Genera `.livereload/index.html` (`src/index.html` + `<script src="cordova.js">`) y lo sirve con `ng serve --configuration livereload` en `0.0.0.0:8100`. Esa configuración también sirve `platforms/android/platform_www`, de modo que `cordova.js` y el plugin de SQLite se cargan desde el dev server.
2. Parchea temporalmente `config.xml` (respaldo en `config.xml.livereload.bak`): `<content>` apunta a `http://<IP de la LAN>:8100`, más `allow-navigation` y HTTP en texto plano (Android 9+ lo bloquea por defecto).
3. Ejecuta `cordova run android` para instalar un APK debug que carga el dev server.
4. Con Ctrl+C detiene `ng serve`, restaura `config.xml`, ejecuta `cordova prepare android` y quita el flag de texto plano del manifest. La app instalada sigue apuntando al dev server hasta que vuelvas a ejecutar `npm run android:run`. Un respaldo huérfano (por un crash) se restaura en el siguiente arranque.

Notas:

- El teléfono debe estar en la misma red Wi-Fi que el computador (la IP de la LAN también sirve para el emulador).
- macOS puede pedir permiso para conexiones entrantes de Node la primera vez.
- Las interfaces virtuales (VPN `utun*`, Docker, ...) se omiten al elegir la IP.
- Los cambios en `src/` recargan el WebView automáticamente.

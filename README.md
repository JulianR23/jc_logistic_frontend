# Proyecto 1 - Frontend

Aplicación web desarrollada con React, TypeScript y Vite para operar el sistema de logística. La interfaz consume la API del backend, gestiona autenticación, navegación protegida y pantallas para consultar y administrar la información principal del negocio.

## Alcance realizado

- Pantalla de login y registro de usuarios.
- Persistencia de la sesión y cierre de sesión.
- Rutas protegidas con guards para usuarios autenticados.
- Dashboard de inicio con resumen de envíos, clientes, productos, bodegas y puertos.
- Módulos de listado y gestión para envíos, clientes, productos, bodegas y puertos.
- Formularios con validación usando React Hook Form y Yup.
- Consumo de datos con React Query.
- Estado global con Zustand.
- Notificaciones visuales para feedback de acciones.

## Tecnologías utilizadas

- React 19
- TypeScript
- Vite
- React Router DOM
- React Hook Form
- Yup
- React Query
- Zustand
- Axios
- Material UI
- Emotion

## Estructura general

- `src/pages`: pantallas principales de la aplicación.
- `src/components/layout`: layout protegido con sidebar y navegación.
- `src/components/ui`: componentes reutilizables de interfaz.
- `src/hooks`: hooks para consumo de datos y llaves de caché.
- `src/router`: configuración de rutas y guards.
- `src/services`: llamadas a la API.
- `src/store`: estado global de sesión e interfaz.
- `src/schemas`: validaciones de formularios.

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Flujo de uso

1. Iniciar sesión o registrarse desde la pantalla pública.
2. Acceder al dashboard con el resumen general de la operación.
3. Navegar por los módulos protegidos para consultar o administrar la información.
4. Cerrar sesión desde el menú lateral cuando sea necesario.

## Notas técnicas

- La aplicación usa un layout protegido para mantener la navegación y la sesión dentro de la experiencia principal.
- Las pantallas consumen la API del backend mediante hooks reutilizables.
- El formulario de acceso permite alternar entre login y registro sin salir de la misma vista.

## Justificación de las tecnologías empleadas

- React: React con Vite fue elegido por la velocidad de desarrollo que ofrece, TypeScript en el frontend comparte las mismas interfaces de tipos con la API, reduciendo errores de integración. Vite incluye un proxy integrado que evita problemas de CORS durante el desarrollo local.

- Zustand + React Query: Se usaron dos herramientas con responsabilidades distintas y complementarias. React Query maneja el estado del servidor: cachea las respuestas de la API, invalida el caché automáticamente después de mutaciones y gestiona los estados de carga y error, eliminando la necesidad de escribir ese código manualmente. Zustand maneja el estado del cliente: la sesión del usuario (token JWT persistido en localStorage) y las notificaciones toast globales.

- Yup: Yup define los schemas de validación de forma declarativa y separada de los componentes, y react-hook-form los conecta con los formularios minimizando re-renders y manteniendo el código del componente limpio.

- Axios: Centraliza todas las llamadas HTTP en una única instancia (api.client.ts) con dos interceptores: el de request inyecta el Bearer token automáticamente en cada llamada sin necesidad de configurarlo en cada servicio, y el de response captura los errores 401 globalmente, limpia la sesión y redirige al login.

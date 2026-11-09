# Implementación de operaciones CRUD en DynamoDB desde la interfaz

El sistema de gestión de órdenes requiere la implementación de operaciones CRUD (Crear, Leer, Actualizar, Eliminar) de órdenes en DynamoDB directamente desde la interfaz de usuario. El objetivo es permitir a los usuarios gestionar sus órdenes de manera eficiente y versionar la infraestructura para asegurar la consistencia y el rendimiento del sistema.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Persistir ordenes en DynamoDB desde la interfaz |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 10 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Definición y modelado de órdenes en DynamoDB

**Objetivo:** Establecer la estructura de datos para las órdenes en DynamoDB y definir las operaciones CRUD.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Identificar los atributos necesarios para una orden (ID, cliente, productos, estado, fecha).
- Definir la tabla de DynamoDB y sus índices necesarios para las operaciones CRUD.
- Establecer las reglas de validación para los atributos de una orden.

**Entregable:** Especificación del modelo de datos para órdenes en DynamoDB y reglas de validación.

<details>
<summary>Pistas de conocimiento</summary>

- Considerar la cardinalidad y las relaciones entre los atributos de una orden.
- Evaluar la necesidad de índices secundarios para mejorar la eficiencia de las consultas.

</details>

### Fase 2: Implementación de operaciones CRUD en la interfaz

**Objetivo:** Desarrollar la funcionalidad para realizar operaciones CRUD de órdenes desde la interfaz de usuario.

**Tiempo estimado:** 5 horas

**Instrucciones:**

- Crear los componentes de la interfaz para cada operación CRUD (Crear, Leer, Actualizar, Eliminar).
- Implementar la lógica para interactuar con DynamoDB y realizar las operaciones CRUD.
- Asegurar que la interfaz valide los datos de entrada según las reglas definidas en la fase anterior.

**Entregable:** Componentes de la interfaz de usuario para operaciones CRUD de órdenes y lógica de interacción con DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Utilizar Terraform para versionar la infraestructura de DynamoDB.
- Considerar el uso de patrones de diseño para organizar la lógica de las operaciones CRUD.

</details>

### Fase 3: Pruebas y optimización de las operaciones CRUD

**Objetivo:** Realizar pruebas exhaustivas de las operaciones CRUD y optimizar el rendimiento y la seguridad del sistema.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Desarrollar casos de prueba para cada operación CRUD y ejecutarlos para asegurar la funcionalidad.
- Identificar y corregir errores o inconsistencias en la implementación.
- Optimizar el rendimiento de las operaciones CRUD, considerando el volumen de datos y la latencia aceptable.
- Asegurar la seguridad de las operaciones, implementando medidas de autenticación y autorización.

**Entregable:** Casos de prueba para operaciones CRUD, informe de corrección de errores y optimización de rendimiento y seguridad.

<details>
<summary>Pistas de conocimiento</summary>

- Utilizar Terraform para simular diferentes escenarios de carga y probar la escalabilidad del sistema.
- Considerar el uso de herramientas de depuración y profiling para identificar cuellos de botella.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué son las operaciones CRUD y por qué son importantes en el manejo de datos en DynamoDB?
- **paraQueSirve**: ¿Para qué sirve versionar la infraestructura con Terraform en este contexto?
- **comoSeUsa**: ¿Cómo se implementan las operaciones CRUD en la interfaz de usuario y se interactúa con DynamoDB?
- **erroresComunes**: ¿Cuáles son los errores comunes al implementar operaciones CRUD y cómo se pueden evitar?
- **queDecisionesImplica**: ¿Qué decisiones de diseño y trade-offs implica la implementación de operaciones CRUD en DynamoDB desde la interfaz?

## Criterios de Evaluacion

- Definición y modelado correcto de órdenes en DynamoDB.
- Implementación funcional de operaciones CRUD en la interfaz de usuario.
- Validación de datos de entrada según las reglas definidas.
- Uso de Terraform para versionar la infraestructura de DynamoDB.
- Optimización del rendimiento y seguridad de las operaciones CRUD.
- Identificación y corrección de errores o inconsistencias en la implementación.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | DynamoDB |
| `client` | `client/` | chapter, support | client | React | React |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd api && npm install && npm run build` — componente `api` (practice).
4. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*

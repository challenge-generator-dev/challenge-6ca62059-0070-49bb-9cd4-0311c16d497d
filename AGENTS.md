# AGENTS.md

Instrucciones para el agente de IA que abra este repositorio (Claude Code, Cursor, Codex, Copilot, Gemini). Se cargan solas: no hay que pegar nada en ningun chat.

## Que es este repositorio

Es el codigo base de un reto de aprendizaje de Pragma: **Implementación de operaciones CRUD en DynamoDB desde la interfaz**.

| | |
|---|---|
| Tema | Persistir ordenes en DynamoDB desde la interfaz |
| Nivel | advanced-l2 |
| Chapter | Frontend |
| Especialidad | React |
| Stack | TypeScript / React 19 |
| Patron arquitectonico | componentes basados en rutas (React Router) |
| Tiempo estimado | 10 horas |

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

## Receta del stack

Esqueleto obligatorio:

- `package.json, vite.config.ts y tsconfig.json en la raiz`
- `src/main.tsx como entry point`
- `src/app con el arbol de rutas`
- `src/features con componentes contenedores y sus hooks`
- `src/shared con componentes presentacionales`
- `src/services con los clientes HTTP`

Trampas conocidas:

- No inventes versiones de npm: una version inexistente hace fallar `npm install` con ETARGET. `@types/react-router-dom` ya no se publica para v6+, React Router trae sus tipos.
- El `package.json` tiene que ser JSON valido y UNICO: nada despues de la llave de cierre.

Dependencias:

- react 19.0.0
- react-dom 19.0.0
- react-router-dom 6.22.0
- @types/react n/a
- @types/react-dom n/a
- axios 1.7.2
- vite 5.0.0
- @vitejs/plugin-react 4.2.1
- typescript 5.7.0

## Tu tarea

Dejar este proyecto en estado **verificable**: que el comando de verificacion corra sin errores. Escribi los archivos en disco, en este repositorio. No generes ZIPs ni archivos adjuntos.

En orden:

1. Segui el orden de arranque del mapa de componentes (infraestructura local primero) y corre `(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q` desde la raiz: mira que falla.
2. Completa lo que falte de la lista de abajo: manifiesto de dependencias, punto de entrada, capa de interfaz y las capas del patron declarado.
3. Arregla SOLO los errores que impiden compilar o arrancar.
4. Volve a correr `(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q` hasta que pase.
5. Pará ahí.

## Regla dura: las fases son trabajo del humano

**PROHIBIDO implementar los entregables de las fases.** El valor del reto esta en que la persona los resuelva. Tu trabajo es que tenga un proyecto que arranca; el hueco pedagogico se queda como esta.

No resuelvas nada de esto:

- **Fase 1 — Definición y modelado de órdenes en DynamoDB**: Especificación del modelo de datos para órdenes en DynamoDB y reglas de validación.
- **Fase 2 — Implementación de operaciones CRUD en la interfaz**: Componentes de la interfaz de usuario para operaciones CRUD de órdenes y lógica de interacción con DynamoDB.
- **Fase 3 — Pruebas y optimización de las operaciones CRUD**: Casos de prueba para operaciones CRUD, informe de corrección de errores y optimización de rendimiento y seguridad.

Distincion operativa:

- **Arreglar** (si): import faltante, tipo que no existe, dependencia sin declarar, error de sintaxis, archivo referenciado que no existe.
- **No tocar** (no): logica de negocio incompleta, validaciones ausentes, secretos hardcodeados, APIs deprecadas que funcionan, concurrencia insegura, patrones mejorables. Eso es lo que la persona tiene que encontrar.

## Lo que falta y tenes que completar

### 1. Referencias colgando (4)

Salieron de un analisis estatico del codigo que SI esta en el repo. Cada una rompe la compilacion:

- [ ] `api/src/domain/order.entity.ts` — `OrderItem.reduce`
      Se invoca `reduce` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/shared/dto/create-order.dto.ts` — `CreateOrderItemDto.reduce`
      Se invoca `reduce` sobre `CreateOrderItemDto`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/shared/validation/order.validation.ts` — `OrderItem.every`
      Se invoca `every` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `client/src/shared/components/Layout.tsx` — `NavItem.map`
      Se invoca `map` sobre `NavItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

### Presentes (45)

- `api/package.json`
- `api/tsconfig.json`
- `api/src/main.ts`
- `api/src/domain/order.entity.ts`
- `api/src/domain/order.repository.ts`
- `api/src/shared/dto/create-order.dto.ts`
- `api/src/shared/dto/update-order.dto.ts`
- `api/src/shared/validation/order.validation.ts`
- `api/src/app.module.ts`
- `api/src/application/order.service.ts`
- `api/src/infrastructure/order.controller.ts`
- `api/src/infrastructure/config/aws.config.ts`
- `api/src/infrastructure/dynamodb/order.repository.impl.ts`
- `api/test/order.controller.spec.ts`
- `api/test/order.service.spec.ts`
- `api/src/infrastructure/filters/http-exception.filter.ts`
- `api/src/shared/filters/http-exception.filter.ts`
- `client/package.json`
- `client/vite.config.ts`
- `client/tsconfig.json`
- `client/src/main.tsx`
- `client/src/app/App.tsx`
- `client/index.html`
- `client/src/features/orders/OrderList.tsx`
- `client/src/features/orders/OrderForm.tsx`
- `client/src/features/orders/OrderDetail.tsx`
- `client/src/services/order.service.ts`
- `client/src/shared/components/Layout.tsx`
- `client/src/shared/validation/order.validation.ts`
- `client/src/index.css`
- `client/src/setupTests.ts`
- `client/src/features/orders/types.ts`
- `infra/providers.tf`
- `infra/variables.tf`
- `infra/modules/dynamodb/variables.tf`
- `infra/versions.tf`
- `infra/README.md`
- `infra/main.tf`
- `infra/outputs.tf`
- `infra/environments/dev/terraform.tfvars`
- `infra/modules/dynamodb/main.tf`
- `infra/modules/dynamodb/outputs.tf`
- `docker-compose.yml`
- `infra-local/README.md`
- `infra-local/dynamodb/create-tables.sh`

### Capas del patron declarado

Cada una tiene que existir como directorio real con al menos un archivo. Codigo plano en la raiz no satisface el patron.

- `api`
- `api/src/domain`
- `api/src/application`
- `api/src/infrastructure`
- `api/src/shared`
- `client`
- `client/src/app`
- `client/src/features/orders`
- `client/src/shared/components`
- `client/src/services`
- `infra`
- `infra/modules/dynamodb`

## Verificacion

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando pasando es la definicion de "terminado" para vos.

## Convenciones que tenes que respetar

- Un solo ecosistema: no declares librerias de otro lenguaje ni mezcles gestores de paquetes.
- Toda libreria que uses tiene que estar declarada en el manifiesto de dependencias.
- Todo import declarado tiene que usarse; todo tipo usado tiene que existir o venir de una dependencia declarada.
- Cada componente vive en su carpeta: instala y compila dentro de ella, y no muevas archivos entre componentes.
- Respeta los contratos entre componentes (endpoints, topics) tal como estan declarados en el mapa de componentes.
- El patron es **componentes basados en rutas (React Router)**: los contratos (interfaces, puertos) los define la capa interna y los implementa la externa, nunca al revés.
- Los archivos que crees llevan implementacion real, no stubs: sin `TODO`, sin cuerpos vacios, sin `// getters y setters`.

## Contexto del candidato

Sirve para calibrar el nivel del codigo, no para resolver las fases.

- Perfil: Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2
- Brecha que el reto ataca: CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261109083811938), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura
- Mision: Gestionar ordenes

---

*Generado por Challenge Generator — Pragma. `README.md` tiene el enunciado completo del reto para la persona. `PROMPT_MEJORA.md` es la variante para pegar en un chat, si se prefiere ese flujo.*

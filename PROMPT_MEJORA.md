# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

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

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/domain/order.entity.ts` — `OrderItem.reduce`: Se invoca `reduce` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/shared/dto/create-order.dto.ts` — `CreateOrderItemDto.reduce`: Se invoca `reduce` sobre `CreateOrderItemDto`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/shared/validation/order.validation.ts` — `OrderItem.every`: Se invoca `every` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/shared/components/Layout.tsx` — `NavItem.map`: Se invoca `map` sobre `NavItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2

### Brecha de conocimiento
CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261109083811938), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura

### Misión / candidato
Gestionar ordenes

### Reto
- Tema: Persistir ordenes en DynamoDB desde la interfaz
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de operaciones CRUD en DynamoDB desde la interfaz
- Tiempo estimado: 10 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Definición y modelado de órdenes en DynamoDB — objetivo: Establecer la estructura de datos para las órdenes en DynamoDB y definir las operaciones CRUD. — entregable (NO resolver): Especificación del modelo de datos para órdenes en DynamoDB y reglas de validación.
- Fase 2: Implementación de operaciones CRUD en la interfaz — objetivo: Desarrollar la funcionalidad para realizar operaciones CRUD de órdenes desde la interfaz de usuario. — entregable (NO resolver): Componentes de la interfaz de usuario para operaciones CRUD de órdenes y lógica de interacción con DynamoDB.
- Fase 3: Pruebas y optimización de las operaciones CRUD — objetivo: Realizar pruebas exhaustivas de las operaciones CRUD y optimizar el rendimiento y la seguridad del sistema. — entregable (NO resolver): Casos de prueba para operaciones CRUD, informe de corrección de errores y optimización de rendimiento y seguridad.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-management-api",
  "version": "1.0.0",
  "description": "API para gestión de órdenes con persistencia en DynamoDB",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^7.3.0",
    "aws-sdk": "^2.1630.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "dotenv": "^16.4.5",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.11.19",
    "@types/supertest": "^2.0.16",
    "@types/uuid": "^9.0.8",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": ".",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "strict": true,
    "strictPropertyInitialization": false,
    "esModuleInterop": true
  },
  "exclude": ["node_modules", "dist", "test"]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Order Management API')
    .setDescription('API para gestión de órdenes con persistencia en DynamoDB')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});

// === ARCHIVO: api/src/domain/order.entity.ts ===
import { v4 as uuidv4 } from 'uuid';

export class OrderEntity {
  readonly id: string;
  readonly customerId: string;
  readonly items: OrderItem[];
  readonly totalAmount: number;
  readonly status: OrderStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    customerId: string,
    items: OrderItem[],
    id?: string,
    status?: OrderStatus,
    createdAt?: Date,
    updatedAt?: Date,
    totalAmount?: number,
  ) {
    this.id = id || uuidv4();
    this.customerId = customerId;
    this.items = items;
    this.totalAmount = totalAmount || this.calculateTotalAmount();
    this.status = status || OrderStatus.PENDING;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.validate();
  }

  private calculateTotalAmount(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private validate(): void {
    if (!this.customerId || this.customerId.trim().length === 0) {
      throw new Error('Customer ID is required');
    }
    if (!this.items || this.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    if (this.totalAmount <= 0) {
      throw new Error('Total amount must be greater than zero');
    }
  }

  updateStatus(newStatus: OrderStatus): OrderEntity {
    return new OrderEntity(
      this.customerId,
      this.items,
      this.id,
      newStatus,
      this.createdAt,
      new Date(),
      this.totalAmount,
    );
  }

  updateItems(newItems: OrderItem[]): OrderEntity {
    return new OrderEntity(
      this.customerId,
      newItems,
      this.id,
      this.status,
      this.createdAt,
      new Date(),
    );
  }
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// === ARCHIVO: api/src/domain/order.repository.ts ===
import { OrderEntity } from './order.entity';

export interface OrderRepository {
  create(order: OrderEntity): Promise<OrderEntity>;
  findById(id: string): Promise<OrderEntity | null>;
  update(id: string, order: OrderEntity): Promise<OrderEntity>;
  delete(id: string): Promise<void>;
}

// === ARCHIVO: api/src/shared/dto/create-order.dto.ts ===
import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItem } from '../../domain/order.entity';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  validate(): void {
    if (!this.items || this.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    const totalAmount = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    if (totalAmount <= 0) {
      throw new Error('Total amount must be greater than zero');
    }
  }
}

// === ARCHIVO: api/src/shared/dto/update-order.dto.ts ===
import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/order.entity';

export class UpdateOrderItemDto {
  @IsString()
  @IsOptional()
  readonly productId?: string;

  @IsString()
  @IsOptional()
  readonly productName?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly quantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly unitPrice?: number;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  readonly customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @IsOptional()
  readonly items?: UpdateOrderItemDto[];

  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly totalAmount?: number;

  validate(): void {
    if (!this.customerId && !this.items && !this.status && this.totalAmount === undefined) {
      throw new Error('At least one field must be provided for update');
    }
    if (this.items && this.items.length === 0) {
      throw new Error('Items array cannot be empty');
    }
  }
}

// === ARCHIVO: api/src/shared/validation/order.validation.ts ===
import { OrderStatus, OrderItem } from '../../domain/order.entity';

export interface ValidationRule {
  field: string;
  validator: (value: any) => boolean;
  message: string;
}

export class OrderValidation {
  private static readonly MIN_ITEMS = 1;
  private static readonly MAX_ITEMS = 100;
  private static readonly MIN_TOTAL_AMOUNT = 0;
  private static readonly MAX_TOTAL_AMOUNT = 999999.99;

  static validateCustomerId(customerId: string): boolean {
    if (!customerId || typeof customerId !== 'string') {
      return false;
    }
    const customerIdPattern = /^CUST-[A-Z0-9]{6,20}$/;
    return customerIdPattern.test(customerId);
  }

  static validateItems(items: OrderItem[]): boolean {
    if (!Array.isArray(items) || items.length < this.MIN_ITEMS) {
      return false;
    }
    if (items.length > this.MAX_ITEMS) {
      return false;
    }
    return items.every(item => this.validateOrderItem(item));
  }

  private static validateOrderItem(item: OrderItem): boolean {
    const hasProductId = item.productId && typeof item.productId === 'string' && item.productId.length > 0;
    const hasQuantity = typeof item.quantity === 'number' && item.quantity > 0;
    const hasUnitPrice = typeof item.unitPrice === 'number' && item.unitPrice >= 0;
    return hasProductId && hasQuantity && hasUnitPrice;
  }

  static validateTotalAmount(amount: number): boolean {
    return typeof amount === 'number' &&
           amount >= this.MIN_TOTAL_AMOUNT &&
           amount <= this.MAX_TOTAL_AMOUNT;
  }

  static validateStatus(status: OrderStatus): boolean {
    const validStatuses = Object.values(OrderStatus);
    return validStatuses.includes(status);
  }

  static validateOrderForCreation(customerId: string, items: OrderItem[], totalAmount: number): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateCustomerId(customerId)) {
      errors.push('Invalid customerId format. Must match pattern CUST-[A-Z0-9]{6,20}');
    }

    if (!this.validateItems(items)) {
      errors.push(`Invalid items: must have between ${this.MIN_ITEMS} and ${this.MAX_ITEMS} valid items`);
    }

    if (!this.validateTotalAmount(totalAmount)) {
      errors.push(`Invalid totalAmount: must be between ${this.MIN_TOTAL_AMOUNT} and ${this.MAX_TOTAL_AMOUNT}`);
    }

    return { valid: errors.length === 0, errors };
  }

  static validateOrderForUpdate(customerId?: string, items?: OrderItem[], status?: OrderStatus, totalAmount?: number): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (customerId !== undefined && !this.validateCustomerId(customerId)) {
      errors.push('Invalid customerId format. Must match pattern CUST-[A-Z0-9]{6,20}');
    }

    if (items !== undefined && !this.validateItems(items)) {
      errors.push(`Invalid items: must have between ${this.MIN_ITEMS} and ${this.MAX_ITEMS} valid items`);
    }

    if (status !== undefined && !this.validateStatus(status)) {
      errors.push(`Invalid status: must be one of ${Object.values(OrderStatus).join(', ')}`);
    }

    if (totalAmount !== undefined && !this.validateTotalAmount(totalAmount)) {
      errors.push(`Invalid totalAmount: must be between ${this.MIN_TOTAL_AMOUNT} and ${this.MAX_TOTAL_AMOUNT}`);
    }

    return { valid: errors.length === 0, errors };
  }

  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>"'&]/g, '');
  }

  static validateId(id: string): boolean {
    if (!id || typeof id !== 'string') return false;
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(id);
  }
}

// === ARCHIVO: api/src/app.module.ts ===
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { OrderController } from './infrastructure/order.controller';
import { OrderService } from './application/order.service';
import { OrderRepository } from './domain/order.repository';
import { OrderRepositoryImpl } from './infrastructure/dynamodb/order.repository.impl';
import { AwsConfig } from './infrastructure/config/aws.config';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: OrderRepositoryImpl,
    },
    AwsConfig,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

// === ARCHIVO: api/src/application/order.service.ts ===
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrderRepository } from '../domain/order.repository';
import { OrderEntity, OrderStatus } from '../domain/order.entity';
import { CreateOrderDto } from '../shared/dto/create-order.dto';
import { UpdateOrderDto } from '../shared/dto/update-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    this.logger.log(`Creating order for customer: ${createOrderDto.customerId}`);

    try {
      createOrderDto.validate();

      const order = new OrderEntity(
        this.generateId(),
        createOrderDto.customerId,
        createOrderDto.items,
        0,
        OrderStatus.PENDING,
        new Date(),
        new Date(),
      );

      order.calculateTotalAmount();
      order.validate();

      const createdOrder = await this.orderRepository.create(order);
      this.logger.log(`Order created successfully with ID: ${createdOrder.id}`);

      return createdOrder;
    } catch (error) {
      this.logger.error(`Failed to create order: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async getOrder(id: string): Promise<OrderEntity> {
    this.logger.log(`Fetching order with ID: ${id}`);

    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const order = await this.orderRepository.findById(id);

      if (!order) {
        this.logger.warn(`Order not found with ID: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      this.logger.log(`Order fetched successfully: ${id}`);
      return order;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(`Failed to fetch order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch order');
    }
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    this.logger.log(`Updating order with ID: ${id}`);

    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const existingOrder = await this.orderRepository.findById(id);

      if (!existingOrder) {
        this.logger.warn(`Order not found for update with ID: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      let updatedOrder = existingOrder;

      if (updateOrderDto.items && updateOrderDto.items.length > 0) {
        updatedOrder = updatedOrder.updateItems(updateOrderDto.items);
      }

      if (updateOrderDto.status) {
        const newStatus = updateOrderDto.status as OrderStatus;
        this.validateStatusTransition(existingOrder.status, newStatus);
        updatedOrder = updatedOrder.updateStatus(newStatus);
      }

      const result = await this.orderRepository.update(id, updatedOrder);
      this.logger.log(`Order updated successfully: ${id}`);

      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(`Failed to update order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update order');
    }
  }

  async deleteOrder(id: string): Promise<void> {
    this.logger.log(`Deleting order with ID: ${id}`);

    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const existingOrder = await this.orderRepository.findById(id);

      if (!existingOrder) {
        this.logger.warn(`Order not found for deletion with ID: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      if (existingOrder.status === OrderStatus.PROCESSING) {
        throw new BadRequestException('Cannot delete an order that is currently being processed');
      }

      await this.orderRepository.delete(id);
      this.logger.log(`Order deleted successfully: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(`Failed to delete order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete order');
    }
  }

  private generateId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const allowed = allowedTransitions[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}

// === ARCHIVO: api/src/infrastructure/order.controller.ts ===
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Inject,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderService } from '../application/order.service';
import { OrderEntity } from '../domain/order.entity';
import { CreateOrderDto } from '../shared/dto/create-order.dto';
import { UpdateOrderDto } from '../shared/dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    @Inject(OrderService)
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    createOrderDto.validate();
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la orden' })
  @ApiResponse({
    status: 200,
    description: 'Orden encontrada',
    type: OrderEntity,
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async getOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderEntity | null> {
    return this.orderService.getOrder(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una orden existente' })
  @ApiParam({ name: 'id', description: 'UUID de la orden' })
  @ApiResponse({
    status: 200,
    description: 'Orden actualizada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    updateOrderDto.validate();
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una orden' })
  @ApiParam({ name: 'id', description: 'UUID de la orden' })
  @ApiResponse({ status: 204, description: 'Orden eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async deleteOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.orderService.deleteOrder(id);
  }
}

// === ARCHIVO: api/src/infrastructure/config/aws.config.ts ===
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

export interface AwsConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
}

const getAwsConfig = (): AwsConfig => {
  const config: AwsConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
  };
  return config;
};

export const configureDynamoDB = (): AWS.DynamoDB.DocumentClient => {
  const config = getAwsConfig();

  const awsConfig: AWS.ConfigurationOptions = {
    region: config.region,
  };

  if (config.accessKeyId && config.secretAccessKey) {
    awsConfig.credentials = {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    };
  }

  if (config.endpoint) {
    awsConfig.endpoint = config.endpoint;
  }

  AWS.config.update(awsConfig);

  return new AWS.DynamoDB.DocumentClient();
};

export const getDynamoDBTableName = (): string => {
  return process.env.DYNAMODB_TABLE_NAME || 'orders';
};

export const createDynamoDBClient = (): AWS.DynamoDB => {
  const config = getAwsConfig();

  const dynamoConfig: AWS.ConfigurationOptions = {
    region: config.region,
  };

  if (config.accessKeyId && config.secretAccessKey) {
    dynamoConfig.credentials = {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    };
  }

  if (config.endpoint) {
    dynamoConfig.endpoint = config.endpoint;
  }

  return new AWS.DynamoDB(dynamoConfig);
};

// === ARCHIVO: api/src/infrastructure/dynamodb/order.repository.impl.ts ===
import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { OrderRepository } from '../../domain/order.repository';
import { OrderEntity, OrderItem, OrderStatus } from '../../domain/order.entity';
import {
  configureDynamoDB,
  getDynamoDBTableName,
} from '../config/aws.config';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  private readonly logger = new Logger(OrderRepositoryImpl.name);
  private readonly docClient: AWS.DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor() {
    this.docClient = configureDynamoDB();
    this.tableName = getDynamoDBTableName();
  }

  async create(order: OrderEntity): Promise<OrderEntity> {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: this.toDynamoItem(order),
    };

    try {
      await this.docClient.put(params).promise();
      this.logger.log(`Orden ${order.id} creada exitosamente en DynamoDB`);
      return order;
    } catch (error) {
      this.logger.error(
        `Error al crear orden ${order.id} en DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: { id },
    };

    try {
      const result = await this.docClient.get(params).promise();

      if (!result.Item) {
        this.logger.warn(`Orden con ID ${id} no encontrada en DynamoDB`);
        return null;
      }

      return this.fromDynamoItem(result.Item);
    } catch (error) {
      this.logger.error(
        `Error al buscar orden ${id} en DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }

  async update(id: string, order: OrderEntity): Promise<OrderEntity> {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression:
        'SET customerId = :customerId, items = :items, totalAmount = :totalAmount, #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':customerId': order.customerId,
        ':items': this.itemsToDynamo(order.items),
        ':totalAmount': order.totalAmount,
        ':status': order.status,
        ':updatedAt': order.updatedAt.toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      const result = await this.docClient.update(params).promise();
      this.logger.log(`Orden ${id} actualizada exitosamente en DynamoDB`);
      return this.fromDynamoItem(result.Attributes);
    } catch (error) {
      this.logger.error(
        `Error al actualizar orden ${id} en DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: { id },
    };

    try {
      await this.docClient.delete(params).promise();
      this.logger.log(`Orden ${id} eliminada exitosamente de DynamoDB`);
    } catch (error) {
      this.logger.error(
        `Error al eliminar orden ${id} en DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }

  private toDynamoItem(order: OrderEntity): Record<string, any> {
    return {
      id: order.id,
      customerId: order.customerId,
      items: this.itemsToDynamo(order.items),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  private fromDynamoItem(item: Record<string, any>): OrderEntity {
    const entity = new OrderEntity(
      item.id,
      item.customerId,
      this.itemsFromDynamo(item.items),
    );
    entity.updateStatus(item.status as OrderStatus);
    return entity;
  }

  private itemsToDynamo(items: OrderItem[]): Record<string, any>[] {
    return items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    }));
  }

  private itemsFromDynamo(items: Record<string, any>[]): OrderItem[] {
    return items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    }));
  }
}

// === ARCHIVO: api/test/order.controller.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { OrderController } from '../src/infrastructure/order.controller';
import { OrderService } from '../src/application/order.service';
import { OrderEntity, OrderStatus } from '../src/domain/order.entity';
import { OrderRepository } from '../src/domain/order.repository';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let orderService: OrderService;

  const mockOrder: OrderEntity = {
    id: 'order-123',
    customerId: 'customer-456',
    items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
    totalAmount: 100,
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    calculateTotalAmount: function(): number { return this.totalAmount; },
    validate: function(): void {},
    updateStatus: function(newStatus: OrderStatus): OrderEntity { 
      this.status = newStatus;
      return this;
    },
    updateItems: function(newItems: any[]): OrderEntity {
      this.items = newItems;
      return this;
    }
  };

  const mockOrderService = {
    createOrder: jest.fn().mockResolvedValue(mockOrder),
    getOrder: jest.fn().mockResolvedValue(mockOrder),
    updateOrder: jest.fn().mockResolvedValue({ ...mockOrder, totalAmount: 150 }),
    deleteOrder: jest.fn().mockResolvedValue(undefined),
  };

  const mockOrderRepository = {
    create: jest.fn().mockResolvedValue(mockOrder),
    findById: jest.fn().mockResolvedValue(mockOrder),
    update: jest.fn().mockResolvedValue(mockOrder),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: OrderRepository, useValue: mockOrderRepository },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
    orderService = moduleFixture.get<OrderService>(OrderService);
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('debería crear una orden exitosamente', async () => {
      const createOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.customerId).toBe(createOrderDto.customerId);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(createOrderDto);
    });

    it('debería fallar con datos inválidos', async () => {
      const invalidDto = { customerId: '', items: [] };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });

    it('debería fallar sin customerId', async () => {
      const invalidDto = { items: [{ productId: 'prod-1', quantity: 2, price: 50 }] };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /orders/:id', () => {
    it('debería obtener una orden por id', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/order-123')
        .expect(200);

      expect(response.body.id).toBe('order-123');
      expect(mockOrderService.getOrder).toHaveBeenCalledWith('order-123');
    });

    it('debería devolver 404 si la orden no existe', async () => {
      mockOrderService.getOrder.mockResolvedValueOnce(null);

      await request(app.getHttpServer())
        .get('/orders/non-existent')
        .expect(404);
    });
  });

  describe('PUT /orders/:id', () => {
    it('debería actualizar una orden exitosamente', async () => {
      const updateOrderDto = {
        items: [{ productId: 'prod-1', quantity: 3, price: 50 }],
      };

      const response = await request(app.getHttpServer())
        .put('/orders/order-123')
        .send(updateOrderDto)
        .expect(200);

      expect(response.body.totalAmount).toBe(150);
      expect(mockOrderService.updateOrder).toHaveBeenCalledWith('order-123', updateOrderDto);
    });

    it('debería devolver 404 si la orden no existe para actualizar', async () => {
      mockOrderService.updateOrder.mockRejectedValueOnce(new Error('Order not found'));

      await request(app.getHttpServer())
        .put('/orders/non-existent')
        .send({ items: [] })
        .expect(404);
    });
  });

  describe('DELETE /orders/:id', () => {
    it('debería eliminar una orden exitosamente', async () => {
      await request(app.getHttpServer())
        .delete('/orders/order-123')
        .expect(204);

      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith('order-123');
    });

    it('debería devolver 404 si la orden no existe para eliminar', async () => {
      mockOrderService.deleteOrder.mockRejectedValueOnce(new Error('Order not found'));

      await request(app.getHttpServer())
        .delete('/orders/non-existent')
        .expect(404);
    });
  });

  describe('Manejo de errores del servidor', () => {
    it('debería manejar errores internos del servidor', async () => {
      mockOrderService.getOrder.mockRejectedValueOnce(new Error('Database error'));

      await request(app.getHttpServer())
        .get('/orders/order-123')
        .expect(500);
    });

    it('debería manejar errores de validación del DTO', async () => {
      const invalidDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: -1, price: 50 }],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('Verificación de idempotencia', () => {
    it('POST /orders debería ser idempotente con el mismo idempotency-key', async () => {
      const createOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .set('Idempotency-Key', 'unique-key-123')
        .send(createOrderDto)
        .expect(201);

      await request(app.getHttpServer())
        .post('/orders')
        .set('Idempotency-Key', 'unique-key-123')
        .send(createOrderDto)
        .expect(201);
    });
  });
});

// === ARCHIVO: api/test/order.service.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../src/application/order.service';
import { OrderRepository } from '../src/domain/order.repository';
import { OrderEntity, OrderStatus, OrderItem } from '../src/domain/order.entity';
import { CreateOrderDto } from '../src/shared/dto/create-order.dto';
import { UpdateOrderDto } from '../src/shared/dto/update-order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let repository: OrderRepository;

  const mockOrderEntity = {
    id: 'order-123',
    customerId: 'customer-456',
    items: [{ productId: 'prod-1', quantity: 2, price: 50 }] as OrderItem[],
    totalAmount: 100,
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    calculateTotalAmount: function(): number { 
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    validate: function(): void { 
      if (!this.customerId || this.items.length === 0) {
        throw new Error('Invalid order');
      }
    },
    updateStatus: function(newStatus: OrderStatus): OrderEntity {
      this.status = newStatus;
      this.updatedAt = new Date();
      return this;
    },
    updateItems: function(newItems: OrderItem[]): OrderEntity {
      this.items = newItems;
      this.totalAmount = this.calculateTotalAmount();
      this.updatedAt = new Date();
      return this;
    }
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((order: OrderEntity) => Promise.resolve(order)),
    findById: jest.fn().mockImplementation((id: string) => {
      if (id === 'order-123') return Promise.resolve(mockOrderEntity as OrderEntity);
      return Promise.resolve(null);
    }),
    update: jest.fn().mockImplementation((id: string, order: OrderEntity) => Promise.resolve(order)),
    delete: jest.fn().mockImplementation((id: string) => Promise.resolve()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<OrderRepository>(OrderRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('debería crear una orden exitosamente', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
      };

      const result = await service.createOrder(createOrderDto);

      expect(result).toBeDefined();
      expect(result.customerId).toBe(createOrderDto.customerId);
      expect(repository.create).toHaveBeenCalled();
    });

    it('debería calcular el monto total correctamente', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [
          { productId: 'prod-1', quantity: 2, price: 50 },
          { productId: 'prod-2', quantity: 1, price: 75 },
        ],
      };

      const result = await service.createOrder(createOrderDto);

      expect(result.totalAmount).toBe(175);
    });

    it('debería lanzar error si los items están vacíos', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [],
      };

      await expect(service.createOrder(createOrderDto)).rejects.toThrow('Invalid order');
    });

    it('debería asignar estado PENDING por defecto', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 1, price: 100 }],
      };

      const result = await service.createOrder(createOrderDto);

      expect(result.status).toBe(OrderStatus.PENDING);
    });
  });

  describe('getOrder', () => {
    it('debería obtener una orden por id', async () => {
      const result = await service.getOrder('order-123');

      expect(result).toBeDefined();
      expect(result?.id).toBe('order-123');
      expect(repository.findById).toHaveBeenCalledWith('order-123');
    });

    it('debería devolver null si la orden no existe', async () => {
      const result = await service.getOrder('non-existent');

      expect(result).toBeNull();
      expect(repository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('updateOrder', () => {
    it('debería actualizar una orden exitosamente', async () => {
      const updateOrderDto: UpdateOrderDto = {
        items: [{ productId: 'prod-1', quantity: 5, price: 50 }],
      };

      const result = await service.updateOrder('order-123', updateOrderDto);

      expect(result).toBeDefined();
      expect(repository.update).toHaveBeenCalledWith('order-123', expect.any(Object));
    });

    it('debería lanzar error si la orden no existe', async () => {
      mockRepository.update.mockRejectedValueOnce(new Error('Order not found'));
      const updateOrderDto: UpdateOrderDto = { items: [] };

      await expect(service.updateOrder('non-existent', updateOrderDto)).rejects.toThrow('Order not found');
    });

    it('debería actualizar solo los campos proporcionados', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.COMPLETED,
      };

      const result = await service.updateOrder('order-123', updateOrderDto);

      expect(result.status).toBe(OrderStatus.COMPLETED);
    });
  });

  describe('deleteOrder', () => {
    it('debería eliminar una orden exitosamente', async () => {
      await expect(service.deleteOrder('order-123')).resolves.not.toThrow();
      expect(repository.delete).toHaveBeenCalledWith('order-123');
    });

    it('debería lanzar error si la orden no existe', async () => {
      mockRepository.delete.mockRejectedValueOnce(new Error('Order not found'));

      await expect(service.deleteOrder('non-existent')).rejects.toThrow('Order not found');
    });
  });

  describe('Cálculos de dominio', () => {
    it('debería recalcular totalAmount al actualizar items', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 1, price: 100 }],
      };

      const order = await service.createOrder(createOrderDto);
      expect(order.totalAmount).toBe(100);

      const updateOrderDto: UpdateOrderDto = {
        items: [
          { productId: 'prod-1', quantity: 2, price: 100 },
          { productId: 'prod-2', quantity: 1, price: 50 },
        ],
      };

      const updatedOrder = await service.updateOrder(order.id, updateOrderDto);
      expect(updatedOrder.totalAmount).toBe(250);
    });

    it('debería validar que quantity sea positivo', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 0, price: 50 }],
      };

      await expect(service.createOrder(createOrderDto)).rejects.toThrow();
    });
  });

  describe('Transiciones de estado', () => {
    it('debería permitir transición de PENDING a COMPLETED', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.COMPLETED,
      };

      const result = await service.updateOrder('order-123', updateOrderDto);

      expect(result.status).toBe(OrderStatus.COMPLETED);
    });

    it('debería permitir transición de PENDING a CANCELLED', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.CANCELLED,
      };

      const result = await service.updateOrder('order-123', updateOrderDto);

      expect(result.status).toBe(OrderStatus.CANCELLED);
    });

    it('no debería permitir transición desde COMPLETED', async () => {
      const order = await service.getOrder('order-123');
      if (order) {
        order.status = OrderStatus.COMPLETED;
      }

      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.PENDING,
      };

      await expect(service.updateOrder('order-123', updateOrderDto)).rejects.toThrow();
    });
  });
});

// === ARCHIVO: api/src/infrastructure/filters/http-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;
        error = (responseObj.error as string) || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    this.logger.warn(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
    );

    response.status(status).json(responseBody);
  }
}

// === ARCHIVO: api/src/shared/filters/http-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        error = (responseObj.error as string) || exception.name;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message: Array.isArray(message) ? message : [message],
    };

    this.logger.warn(
      `HTTP Exception: ${status} - ${message} - ${request.method} ${request.url}`,
    );

    response.status(status).json(responseBody);
  }
}

// === ARCHIVO: client/package.json ===
{
  "name": "order-management-client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.7.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.7.0",
    "vite": "^5.0.0",
    "@types/node": "^20.11.19",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vitest": "^1.2.2",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.3.0",
    "jsdom": "^24.0.0"
  },
  "eslintConfig": {
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended"
    ],
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true
      }
    },
    "rules": {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off"
    },
    "settings": {
      "react": {
        "version": "detect"
      }
    }
  }
}

// === ARCHIVO: client/vite.config.ts ===
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});

// === ARCHIVO: client/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": [
      "DOM",
      "DOM.Iterable",
      "ESNext"
    ],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ],
      "@features/*": [
        "src/features/*"
      ],
      "@shared/*": [
        "src/shared/*"
      ],
      "@services/*": [
        "src/services/*"
      ]
    }
  },
  "include": [
    "src"
  ]
}


// === ARCHIVO: client/src/main.tsx ===
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Error boundary para manejar errores en tiempo de ejecución
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Algo salió mal</h1>
          <p>Hemos encontrado un error inesperado. Por favor, recarga la página.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Configuración de Axios para manejar errores globales
import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error en la respuesta:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Error en la solicitud:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// === ARCHIVO: client/src/app/App.tsx ===
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@shared/components/Layout';
import { OrderList } from '@features/orders/OrderList';
import { OrderForm } from '@features/orders/OrderForm';
import { OrderDetail } from '@features/orders/OrderDetail';
import { OrderEntity } from '../features/orders/types';

const App = () => {
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [location.pathname]);

  const handleOrderCreated = (newOrder: OrderEntity) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const handleOrderUpdated = (updatedOrder: OrderEntity) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  const handleOrderDeleted = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OrderList orders={orders} onDelete={handleOrderDeleted} />} />
        <Route
          path="/orders/new"
          element={<OrderForm onOrderCreated={handleOrderCreated} />}
        />
        <Route
          path="/orders/:id/edit"
          element={<OrderForm onOrderUpdated={handleOrderUpdated} />}
        />
        <Route
          path="/orders/:id"
          element={<OrderDetail onDelete={handleOrderDeleted} />}
        />
      </Routes>
    </Layout>
  );
};

export default App;

// === ARCHIVO: client/index.html ===
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de gestión de órdenes con operaciones CRUD en DynamoDB" />
    <meta name="theme-color" content="#2563eb" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Order Management" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Gestión de Órdenes" />
    <meta property="og:description" content="Sistema de gestión de órdenes con operaciones CRUD" />
    <meta property="og:url" content="http://localhost:5173" />
    <meta property="og:site_name" content="Order Management" />
    <title>Gestión de Órdenes</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      body {
        min-height: 100vh;
        background-color: #f8fafc;
        color: #1e293b;
      }
      #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8fafc;
        z-index: 9999;
      }
      .loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e2e8f0;
        border-top-color: #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .error-container {
        padding: 2rem;
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
      }
      .error-container h1 {
        color: #dc2626;
        margin-bottom: 1rem;
      }
      .error-container p {
        color: #64748b;
        margin-bottom: 1.5rem;
      }
      .retry-button {
        background-color: #2563eb;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      .retry-button:hover {
        background-color: #1d4ed8;
      }
      .retry-button:active {
        background-color: #1e40af;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="loading-screen">
        <div class="loading-spinner" role="status" aria-label="Cargando aplicación"></div>
      </div>
    </div>
    <script type="module" src="/src/main.tsx"></script>
    <script>
      (function() {
        const root = document.getElementById('root');
        const loadingScreen = root.querySelector('.loading-screen');
        
        window.addEventListener('error', function(event) {
          if (loadingScreen && event.error) {
            loadingScreen.innerHTML = `
              <div class="error-container">
                <h1>Error de aplicación</h1>
                <p>Ha ocurrido un error inesperado. Por favor, recarga la página.</p>
                <button class="retry-button" onclick="window.location.reload()">
                  Recargar página
                </button>
              </div>
            `;
          }
        });
        
        window.addEventListener('unhandledrejection', function(event) {
          console.error('Unhandled promise rejection:', event.reason);
        });
      })();
    </script>
  </body>
</html>

// === ARCHIVO: client/src/features/orders/OrderList.tsx ===
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OrderService } from '@services/order.service';
import type { OrderEntity } from '@services/order.service';

interface OrderListProps {
  onError: (message: string) => void;
}

export function OrderList({ onError }: OrderListProps) {
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const orderService = new OrderService();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      onError('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta orden?')) {
      return;
    }

    try {
      setDeletingId(id);
      await orderService.deleteOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (error) {
      onError('Error al eliminar la orden');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="order-list-loading">
        <div className="spinner" aria-label="Cargando órdenes"></div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-list-empty">
        <p>No hay órdenes disponibles</p>
        <Link to="/orders/new" className="btn btn-primary">
          Crear primera orden
        </Link>
      </div>
    );
  }

  return (
    <div className="order-list">
      <div className="order-list-header">
        <h2>Lista de Órdenes</h2>
        <Link to="/orders/new" className="btn btn-primary">
          Nueva Orden
        </Link>
      </div>

      <table className="order-table" aria-label="Lista de órdenes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.productName}</td>
              <td>{order.quantity}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <span className={`status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td className="actions">
                <Link
                  to={`/orders/${order.id}`}
                  className="btn btn-secondary"
                  aria-label={`Ver detalles de orden ${order.id}`}
                >
                  Ver
                </Link>
                <Link
                  to={`/orders/${order.id}/edit`}
                  className="btn btn-secondary"
                  aria-label={`Editar orden ${order.id}`}
                >
                  Editar
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(order.id)}
                  disabled={deletingId === order.id}
                  aria-label={`Eliminar orden ${order.id}`}
                >
                  {deletingId === order.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// === ARCHIVO: client/src/features/orders/OrderForm.tsx ===
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrderService } from '@services/order.service';
import { validateOrderForm, type OrderFormData } from '@shared/validation/order.validation';
import type { OrderEntity, CreateOrderDto, UpdateOrderDto } from '@services/order.service';

interface OrderFormProps {
  onError: (message: string) => void;
}

export function OrderForm({ onError }: OrderFormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const orderService = new OrderService();

  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    productName: '',
    quantity: 1,
    price: 0,
    status: 'PENDING'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing && id) {
      loadOrder(id);
    }
  }, [id, isEditing]);

  const loadOrder = async (orderId: string) => {
    try {
      setInitialLoading(true);
      const order = await orderService.getOrder(orderId);
      setFormData({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        productName: order.productName,
        quantity: order.quantity,
        price: order.price,
        status: order.status
      });
    } catch (error) {
      onError('Error al cargar la orden');
      navigate('/orders');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateOrderForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing && id) {
        const updateData: UpdateOrderDto = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          productName: formData.productName,
          quantity: formData.quantity,
          price: formData.price,
          status: formData.status
        };
        await orderService.updateOrder(id, updateData);
      } else {
        const createData: CreateOrderDto = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          productName: formData.productName,
          quantity: formData.quantity,
          price: formData.price
        };
        await orderService.createOrder(createData);
      }
      
      navigate('/orders');
    } catch (error) {
      onError(`Error al ${isEditing ? 'actualizar' : 'crear'} la orden`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="order-form-loading">
        <div className="spinner" aria-label="Cargando orden"></div>
        <p>Cargando orden...</p>
      </div>
    );
  }

  return (
    <div className="order-form">
      <h2>{isEditing ? 'Editar Orden' : 'Nueva Orden'}</h2>
      
      <form onSubmit={handleSubmit} aria-label={`Formulario de ${isEditing ? 'edición' : 'creación'} de orden`}>
        <div className="form-group">
          <label htmlFor="customerName">Nombre del Cliente</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className={errors.customerName ? 'error' : ''}
            aria-invalid={Boolean(errors.customerName)}
            aria-describedby={errors.customerName ? 'customerName-error' : undefined}
          />
          {errors.customerName && (
            <span id="customerName-error" className="error-message">
              {errors.customerName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="customerEmail">Email del Cliente</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            className={errors.customerEmail ? 'error' : ''}
            aria-invalid={Boolean(errors.customerEmail)}
            aria-describedby={errors.customerEmail ? 'customerEmail-error' : undefined}
          />
          {errors.customerEmail && (
            <span id="customerEmail-error" className="error-message">
              {errors.customerEmail}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="productName">Nombre del Producto</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className={errors.productName ? 'error' : ''}
            aria-invalid={Boolean(errors.productName)}
            aria-describedby={errors.productName ? 'productName-error' : undefined}
          />
          {errors.productName && (
            <span id="productName-error" className="error-message">
              {errors.productName}
            </span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">Cantidad</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className={errors.quantity ? 'error' : ''}
              aria-invalid={Boolean(errors.quantity)}
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio Unitario</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={errors.price ? 'error' : ''}
              aria-invalid={Boolean(errors.price)}
            />
            {errors.price && (
              <span className="error-message">{errors.price}</span>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="PENDING">Pendiente</option>
              <option value="PROCESSING">Procesando</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        )}

        <div className="form-summary">
          <span>Total: </span>
          <strong>${(formData.quantity * formData.price).toFixed(2)}</strong>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/orders')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

// === ARCHIVO: client/src/features/orders/OrderDetail.tsx ===
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { OrderService } from '@services/order.service';
import type { OrderEntity } from '@services/order.service';

interface OrderDetailProps {
  onError: (message: string) => void;
}

export function OrderDetail({ onError }: OrderDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderService = new OrderService();

  const [order, setOrder] = useState<OrderEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder(id);
    }
  }, [id]);

  const loadOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const data = await orderService.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      onError('Error al cargar los detalles de la orden');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('¿Está seguro de que desea eliminar esta orden?')) {
      return;
    }

    try {
      setDeleting(true);
      await orderService.deleteOrder(id);
      navigate('/orders');
    } catch (error) {
      onError('Error al eliminar la orden');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      PROCESSING: 'Procesando',
      COMPLETED: 'Completado',
      CANCELLED: 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string): string => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="order-detail-loading">
        <div className="spinner" aria-label="Cargando detalles de la orden"></div>
        <p>Cargando detalles de la orden...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-not-found">
        <p>Orden no encontrada</p>
        <Link to="/orders" className="btn btn-primary">
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="order-detail">
      <div className="order-detail-header">
        <h2>Detalles de la Orden</h2>
        <div className="header-actions">
          <Link
            to={`/orders/${order.id}/edit`}
            className="btn btn-secondary"
            aria-label={`Editar orden ${order.id}`}
          >
            Editar
          </Link>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
            aria-label={`Eliminar orden ${order.id}`}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      <div className="order-detail-content">
        <section className="order-info" aria-label="Información de la orden">
          <h3>Información General</h3>
          <dl className="detail-list">
            <div className="detail-item">
              <dt>ID de Orden</dt>
              <dd>{order.id}</dd>
            </div>
            <div className="detail-item">
              <dt>Estado</dt>
              <dd>
                <span className={getStatusClass(order.status)}>
                  {getStatusLabel(order.status)}
                </span>
              </dd>
            </div>
            <div className="detail-item">
              <dt>Fecha de Creación</dt>
              <dd>{new Date(order.createdAt).toLocaleString('es-ES')}</dd>
            </div>
            {order.updatedAt && (
              <div className="detail-item">
                <dt>Última Actualización</dt>
                <dd>{new Date(order.updatedAt).toLocaleString('es-ES')}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="customer-info" aria-label="Información del cliente">
          <h3>Información del Cliente</h3>
          <dl className="detail-list">
            <div className="detail-item">
              <dt>Nombre</dt>
              <dd>{order.customerName}</dd>
            </div>
            <div className="detail-item">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${order.customerEmail}`}>
                  {order.customerEmail}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section className="product-info" aria-label="Información del producto">
          <h3>Información del Producto</h3>
          <dl className="detail-list">
            <div className="detail-item">
              <dt>Producto</dt>
              <dd>{order.productName}</dd>
            </div>
            <div className="detail-item">
              <dt>Cantidad</dt>
              <dd>{order.quantity}</dd>
            </div>
            <div className="detail-item">
              <dt>Precio Unitario</dt>
              <dd>${order.price.toFixed(2)}</dd>
            </div>
            <div className="detail-item">
              <dt>Total</dt>
              <dd className="total-amount">${order.total.toFixed(2)}</dd>
            </div>
          </dl>
        </section>

        <div className="order-detail-actions">
          <Link to="/orders" className="btn btn-secondary">
            Volver a la lista
          </Link>
        </div>
      </div>
    </div>
  );
}

// === ARCHIVO: client/src/services/order.service.ts ===
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  items: OrderItemDto[];
  totalAmount: number;
  status?: string;
}

export interface UpdateOrderDto {
  customerName?: string;
  customerEmail?: string;
  items?: OrderItemDto[];
  totalAmount?: number;
  status?: string;
}

export interface OrderItemDto {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEntity {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItemDto[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

const API_BASE_URL = 'http://localhost:3000';

export class OrderService {
  private readonly axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
          const errorMessage = error.response.data?.message || 'Error en la solicitud';
          console.error(`[OrderService] Error ${error.response.status}: ${errorMessage}`);
          return Promise.reject(new Error(errorMessage));
        } else if (error.request) {
          console.error('[OrderService] No se recibió respuesta del servidor');
          return Promise.reject(new Error('No se pudo conectar con el servidor'));
        } else {
          console.error('[OrderService] Error al configurar la solicitud:', error.message);
          return Promise.reject(new Error('Error al procesar la solicitud'));
        }
      }
    );
  }

  async createOrder(orderData: CreateOrderDto): Promise<OrderEntity> {
    const config: AxiosRequestConfig<CreateOrderDto> = {
      method: 'POST',
      url: '/orders',
      data: orderData,
    };

    const response = await this.axiosInstance.request<OrderEntity>(config);
    return response.data;
  }

  async getOrder(orderId: string): Promise<OrderEntity> {
    if (!orderId || orderId.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }

    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/orders/${encodeURIComponent(orderId)}`,
    };

    const response = await this.axiosInstance.request<OrderEntity>(config);
    return response.data;
  }

  async updateOrder(orderId: string, orderData: UpdateOrderDto): Promise<OrderEntity> {
    if (!orderId || orderId.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }

    const config: AxiosRequestConfig<UpdateOrderDto> = {
      method: 'PUT',
      url: `/orders/${encodeURIComponent(orderId)}`,
      data: orderData,
    };

    const response = await this.axiosInstance.request<OrderEntity>(config);
    return response.data;
  }

  async deleteOrder(orderId: string): Promise<void> {
    if (!orderId || orderId.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }

    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: `/orders/${encodeURIComponent(orderId)}`,
    };

    await this.axiosInstance.request(config);
  }

  async listOrders(): Promise<OrderEntity[]> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/orders',
    };

    const response = await this.axiosInstance.request<OrderEntity[]>(config);
    return response.data;
  }
}

export const orderService = new OrderService();
export default orderService;

// === ARCHIVO: client/src/shared/components/Layout.tsx ===
import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const HomeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const OrdersIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const MenuIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/', label: 'Inicio', icon: <HomeIcon /> },
    { path: '/orders', label: 'Órdenes', icon: <OrdersIcon /> },
  ];

  const isActivePath = (path: string): boolean => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      handleCloseMobileMenu();
    }
  };

  return (
    <div className="layout" onKeyDown={handleKeyDown} role="application" aria-label="Aplicación de gestión de órdenes">
      <header className="layout-header">
        <div className="layout-header-content">
          <Link to="/" className="layout-logo" aria-label="Ir a inicio">
            <span className="layout-logo-text">OrderManager</span>
          </Link>

          <button
            className="layout-mobile-toggle"
            onClick={handleToggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="main-navigation"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <nav
            id="main-navigation"
            className={`layout-nav ${isMobileMenuOpen ? 'layout-nav--open' : ''}`}
            aria-label="Navegación principal"
          >
            <ul className="layout-nav-list" role="list">
              {navItems.map((item) => (
                <li key={item.path} className="layout-nav-item">
                  <Link
                    to={item.path}
                    className={`layout-nav-link ${isActivePath(item.path) ? 'layout-nav-link--active' : ''}`}
                    onClick={handleCloseMobileMenu}
                    aria-current={isActivePath(item.path) ? 'page' : undefined}
                  >
                    <span className="layout-nav-icon" aria-hidden="true">{item.icon}</span>
                    <span className="layout-nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="layout-main" role="main" id="main-content">
        <div className="layout-main-content">
          {children}
        </div>
      </main>

      <footer className="layout-footer" role="contentinfo">
        <div className="layout-footer-content">
          <p className="layout-footer-text">
            © 2024 OrderManager. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

// === ARCHIVO: client/src/shared/validation/order.validation.ts ===
export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface OrderFormData {
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const MIN_QUANTITY = 1;
const MIN_PRICE = 0.01;

export const validationRules = {
  customerName: [
    {
      validate: (value: string) => value && value.trim().length > 0,
      message: 'El nombre del cliente es requerido',
    },
    {
      validate: (value: string) => value && value.trim().length >= NAME_MIN_LENGTH,
      message: `El nombre debe tener al menos ${NAME_MIN_LENGTH} caracteres`,
    },
    {
      validate: (value: string) => value && value.trim().length <= NAME_MAX_LENGTH,
      message: `El nombre no puede exceder ${NAME_MAX_LENGTH} caracteres`,
    },
  ],
  customerEmail: [
    {
      validate: (value: string) => value && value.trim().length > 0,
      message: 'El correo electrónico es requerido',
    },
    {
      validate: (value: string) => EMAIL_REGEX.test(value),
      message: 'Por favor ingrese un correo electrónico válido',
    },
  ],
  items: [
    {
      validate: (value: unknown[]) => value && value.length > 0,
      message: 'Debe agregar al menos un producto a la orden',
    },
  ],
  itemQuantity: [
    {
      validate: (value: number) => value >= MIN_QUANTITY,
      message: `La cantidad debe ser al menos ${MIN_QUANTITY}`,
    },
  ],
  itemUnitPrice: [
    {
      validate: (value: number) => value >= MIN_PRICE,
      message: `El precio debe ser mayor a ${MIN_PRICE}`,
    },
  ],
  totalAmount: [
    {
      validate: (value: number) => value > 0,
      message: 'El monto total debe ser mayor a 0',
    },
  ],
  status: [
    {
      validate: (value: string) => value && value.trim().length > 0,
      message: 'El estado de la orden es requerido',
    },
    {
      validate: (value: string) => ['pending', 'processing', 'completed', 'cancelled'].includes(value.toLowerCase()),
      message: 'El estado debe ser: pending, processing, completed o cancelled',
    },
  ],
};

export function validateField<T>(fieldName: string, value: T): string | null {
  const rules = validationRules[fieldName as keyof typeof validationRules] as ValidationRule<T>[] | undefined;
  
  if (!rules) {
    return null;
  }

  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }

  return null;
}

export function validateOrderForm(data: OrderFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const nameError = validateField('customerName', data.customerName);
  if (nameError) errors.customerName = nameError;

  const emailError = validateField('customerEmail', data.customerEmail);
  if (emailError) errors.customerEmail = emailError;

  const itemsError = validateField('items', data.items);
  if (itemsError) errors.items = itemsError;

  const totalError = validateField('totalAmount', data.totalAmount);
  if (totalError) errors.totalAmount = totalError;

  const statusError = validateField('status', data.status);
  if (statusError) errors.status = statusError;

  if (data.items && data.items.length > 0) {
    data.items.forEach((item, index) => {
      const quantityError = validateField('itemQuantity', item.quantity);
      if (quantityError) errors[`items[${index}].quantity`] = quantityError;

      const priceError = validateField('itemUnitPrice', item.unitPrice);
      if (priceError) errors[`items[${index}].unitPrice`] = priceError;

      if (!item.productId || item.productId.trim() === '') {
        errors[`items[${index}].productId`] = 'El ID del producto es requerido';
      }

      if (!item.productName || item.productName.trim() === '') {
        errors[`items[${index}].productName`] = 'El nombre del producto es requerido';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateItemQuantity(quantity: number): string | null {
  return validateField('itemQuantity', quantity);
}

export function validateItemPrice(price: number): string | null {
  return validateField('itemUnitPrice', price);
}

export function validateCustomerName(name: string): string | null {
  return validateField('customerName', name);
}

export function validateCustomerEmail(email: string): string | null {
  return validateField('customerEmail', email);
}

export function validateStatus(status: string): string | null {
  return validateField('status', status);
}

export function calculateTotalAmount(items: Array<{ quantity: number; unitPrice: number }>): number {
  if (!items || items.length === 0) return 0;
  
  return items.reduce((total, item) => {
    const quantity = item.quantity ?? 0;
    const unitPrice = item.unitPrice ?? 0;
    return total + (quantity * unitPrice);
  }, 0);
}

export function sanitizeOrderInput(data: Partial<OrderFormData>): OrderFormData {
  return {
    customerName: data.customerName?.trim() || '',
    customerEmail: data.customerEmail?.trim().toLowerCase() || '',
    items: data.items?.map((item) => ({
      productId: item.productId?.trim() || '',
      productName: item.productName?.trim() || '',
      quantity: Math.max(MIN_QUANTITY, item.quantity || MIN_QUANTITY),
      unitPrice: Math.max(MIN_PRICE, item.unitPrice || MIN_PRICE),
    })) || [],
    totalAmount: data.totalAmount || 0,
    status: data.status?.trim().toLowerCase() || 'pending',
  };
}

export function validateOrder(data: OrderFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const nameError = validateCustomerName(data.customerName);
  if (nameError) errors.customerName = nameError;

  const emailError = validateCustomerEmail(data.customerEmail);
  if (emailError) errors.customerEmail = emailError;

  if (!data.items || data.items.length === 0) {
    errors.items = 'Debe agregar al menos un producto a la orden';
  } else {
    data.items.forEach((item, index) => {
      const quantityError = validateItemQuantity(item.quantity);
      if (quantityError) errors[`items[${index}].quantity`] = quantityError;

      const priceError = validateItemPrice(item.unitPrice);
      if (priceError) errors[`items[${index}].unitPrice`] = priceError;

      if (!item.productId || item.productId.trim() === '') {
        errors[`items[${index}].productId`] = 'El ID del producto es requerido';
      }

      if (!item.productName || item.productName.trim() === '') {
        errors[`items[${index}].productName`] = 'El nombre del producto es requerido';
      }
    });
  }

  if (data.totalAmount <= 0) {
    errors.totalAmount = 'El monto total debe ser mayor a 0';
  }

  const statusError = validateStatus(data.status);
  if (statusError) errors.status = statusError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// === ARCHIVO: client/src/index.css ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/setupTests.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
// Agrega aca matchers globales o mocks compartidos.
export {};


// === ARCHIVO: client/src/features/orders/types.ts ===
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEntity {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

// === ARCHIVO: infra/providers.tf ===
# Configuración de los proveedores de Terraform para AWS
# Este archivo declara los proveedores necesarios y sus versiones
# para gestionar la infraestructura en AWS.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.31.0"
    }
  }
  # Se asume que el backend y la versión de Terraform
  # están configurados en versions.tf (generado en otro lote)
}

# Configuración del provider AWS
# Las credenciales y región se toman de las variables de entorno
# o de la configuración de AWS CLI.
provider "aws" {
  region = var.aws_region
}

# Variable para la región de AWS
# Se define aquí para que esté disponible en el provider AWS,
# pero su declaración formal está en variables.tf
variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

// === ARCHIVO: infra/variables.tf ===
# Variables de entrada para la configuración de la infraestructura
# Estas variables permiten parametrizar la infraestructura para
# diferentes entornos (dev, staging, prod).

variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes"
  type        = string
  default     = "orders-table"
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
  default     = "orderId"
}

variable "dynamodb_range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB"
  type        = string
  default     = "customerId"
}

variable "dynamodb_attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "orderId"
      type = "S"
    },
    {
      name = "customerId"
      type = "S"
    },
    {
      name = "orderDate"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    }
  ]
}

variable "dynamodb_global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name            = string
    hash_key       = string
    range_key      = string
    projection_type = string
    read_capacity  = number
    write_capacity = number
  }))
  default = [
    {
      name            = "CustomerIndex"
      hash_key       = "customerId"
      range_key      = "orderDate"
      projection_type = "ALL"
      read_capacity  = 5
      write_capacity = 5
    }
  ]
}

// === ARCHIVO: infra/modules/dynamodb/variables.tf ===
# Variables de entrada para el módulo de DynamoDB
# Estas variables permiten configurar la tabla DynamoDB
# y sus propiedades según los requisitos del entorno.

variable "table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
}

variable "range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB"
  type        = string
  default     = ""
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
}

variable "global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name            = string
    hash_key       = string
    range_key      = string
    projection_type = string
    read_capacity  = number
    write_capacity = number
  }))
  default = []
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
}

variable "tags" {
  description = "Etiquetas adicionales para la tabla DynamoDB"
  type        = map(string)
  default     = {}
}

// === ARCHIVO: infra/versions.tf ===
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.31.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "gestion-ordenes"
      ManagedBy   = "terraform"
    }
  }

  dynamic "assume_role" {
    for_each = var.assume_role_arn != "" ? [var.assume_role_arn] : []

    content {
      role_arn = assume_role.value
    }
  }

  skip_credentials_validation = var.skip_credentials_validation
  skip_requesting_account_id  = var.skip_requesting_account_id
  skip_metadata_api_check     = var.skip_metadata_api_check
}

// === ARCHIVO: infra/README.md ===
# Módulo de Infraestructura - Gestión de Órdenes

## Propósito

Este módulo define la infraestructura necesaria para el sistema de gestión de órdenes, específicamente los recursos de DynamoDB para persistencia de datos.

## Recursos Definidos

- **Tabla DynamoDB Principal**: Almacena las órdenes del sistema con capacidad de lectura/escritura aprovisionada.
- **Índices Secundarios**: Optimizan consultas por diferentes atributos (cliente, fecha, estado).
- **Replicación**: Configuración de Table Class para optimización de costos.

## Estructura del Módulo

```
infra/
├── versions.tf          # Configuración de providers y versiones de Terraform
├── main.tf              # Definición de recursos principales
├── variables.tf         # Parámetros de entrada
├── outputs.tf           # Valores exportados
└── modules/
    └── dynamodb/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

## Uso Básico

```hcl
module "infra" {
  source = "./infra"

  aws_region      = "us-east-1"
  environment     = "dev"
  table_name      = "ordenes"
  billing_mode    = "PROVISIONED"
  read_capacity   = 5
  write_capacity  = 5
}
```

## Variables Requeridas

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `aws_region` | string | Región de AWS donde se desplegará la infraestructura |
| `environment` | string | Entorno de despliegue (dev, staging, prod) |
| `table_name` | string | Nombre de la tabla DynamoDB |

## Variables Opcionales

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `billing_mode` | string | "PROVISIONED" | Modo de facturación |
| `read_capacity` | number | 5 | Capacidad de lectura aprovisionada |
| `write_capacity` | number | 5 | Capacidad de escritura aprovisionada |
| `table_class` | string | "STANDARD" | Clase de tabla DynamoDB |
| `enable_server_side_encryption` | bool | true | Habilitar cifrado en servidor |
| `enable_point_in_time_recovery` | bool | true | Habilitar recuperación a punto en tiempo |
| `enable_ttl` | bool | true | Habilitar TTL para limpieza automática |

## Validación Local

Para validar la configuración de Terraform:

```bash
cd infra
terraform init
terraform validate
terraform plan
```

## Consideraciones de Seguridad

- El cifrado en servidor está habilitado por defecto usando AWS-managed KMS key.
- El modo de facturación PROVISIONED permite control de costos en entornos de desarrollo.
- La recuperación a punto en tiempo está habilitada para cumplimiento de requisitos de disponibilidad.

## Notas de Optimización

- Para producción, considerar cambiar a modo PAY_PER_REQUEST.
- Ajustar capacidades según patrones de tráfico observados.
- Usar Table Class STANDARD_INFREQUENT_ACCESS para datos históricos.

// === ARCHIVO: infra/main.tf ===
# Configuración de recursos de infraestructura para el sistema de gestión de órdenes

# Módulo de tabla DynamoDB para almacenar órdenes
module "dynamodb_orders" {
  source = "./modules/dynamodb"

  table_name        = var.table_name
  billing_mode      = var.billing_mode
  read_capacity     = var.read_capacity
  write_capacity    = var.write_capacity
  table_class       = var.table_class
  environment       = var.environment

  # Configuración de atributos para la tabla
  hash_key          = "orderId"
  range_key         = "createdAt"

  # Habilitar características de protección de datos
  enable_server_side_encryption = var.enable_server_side_encryption
  enable_point_in_time_recovery = var.enable_point_in_time_recovery
  enable_ttl                    = var.enable_ttl
  ttl_attribute_name            = "expiresAt"

  # Tags para identificación y costeo
  tags = {
    Name        = "ordenes-${var.environment}"
    Environment = var.environment
    Project     = "gestion-ordenes"
    ManagedBy   = "terraform"
    Description = "Tabla DynamoDB para persistencia de órdenes"
  }
}

# Configuración de políticas de acceso a la tabla
data "aws_iam_policy_document" "dynamodb_access" {
  statement {
    sid = "AllowReadWriteToOrdersTable"

    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
    ]

    resources = [
      module.dynamodb_orders.table_arn,
      "${module.dynamodb_orders.table_arn}/index/*"
    ]

    effect = "Allow"
  }

  statement {
    sid = "AllowDescribeTable"

    actions = [
      "dynamodb:DescribeTable",
      "dynamodb:DescribeTimeToLive",
      "dynamodb:DescribeContinuousBackups"
    ]

    resources = [module.dynamodb_orders.table_arn]

    effect = "Allow"
  }
}

# Política de acceso a DynamoDB
resource "aws_iam_policy" "dynamodb_orders_policy" {
  name        = "dynamodb-orders-${var.environment}-access"
  description = "Política de acceso a la tabla de órdenes en DynamoDB"
  policy      = data.aws_iam_policy_document.dynamodb_access.json

  tags = {
    Name        = "ordenes-${var.environment}-access-policy"
    Environment = var.environment
    Project     = "gestion-ordenes"
  }
}

# Configuración de backup automático para recuperación
resource "aws_backup_plan" "orders_backup" {
  name = "ordenes-${var.environment}-backup"

  rule {
    name                = "daily-backup"
    target_vault_name   = "default"
    schedule            = "cron(0 5 ? * * *)"
    start_window        = 60
    completion_window   = 180
    lifecycle {
      cold_storage_after = 30
      delete_after       = 90
    }
    copy_action {
      destination_vault_arn = "arn:aws:backup:us-east-1:123456789012:backup-vault:default"
    }
  }

  rule {
    name                = "weekly-long-term-backup"
    target_vault_name   = "default"
    schedule            = "cron(0 6 ? * 1 *)"
    start_window        = 60
    completion_window   = 300
    lifecycle {
      cold_storage_after = 90
      delete_after       = 365
    }
  }

  tags = {
    Name        = "ordenes-${var.environment}-backup-plan"
    Environment = var.environment
  }
}

resource "aws_backup_selection" "orders_backup_selection" {
  iam_role_arn = aws_iam_role.backup_role.arn
  name         = "ordenes-backup-selection"
  plan_id      = aws_backup_plan.orders_backup.id

  resources = [module.dynamodb_orders.table_arn]

  condition {
    string_not_equals {
      key   = "aws:RequestTag/Backup"
      value = "false"
    }
  }
}

resource "aws_iam_role" "backup_role" {
  name = "backup-orders-${var.environment}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "backup_role_policy" {
  role       = aws_iam_role.backup_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

# Alerta de CloudWatch para métricas de la tabla
resource "aws_cloudwatch_metric_alarm" "orders_read_throttle" {
  alarm_name          = "ordenes-${var.environment}-read-throttle"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Alerta cuando las solicitudes de lectura están siendo limitadas"

  dimensions = {
    TableName = var.table_name
  }

  alarm_actions = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  ok_actions    = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  tags = {
    Name        = "ordenes-${var.environment}-read-throttle-alarm"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "orders_write_throttle" {
  alarm_name          = "ordenes-${var.environment}-write-throttle"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Alerta cuando las solicitudes de escritura están siendo limitadas"

  dimensions = {
    TableName = var.table_name
  }

  alarm_actions = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  ok_actions    = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  tags = {
    Name        = "ordenes-${var.environment}-write-throttle-alarm"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "orders_consumed_read_capacity" {
  alarm_name          = "ordenes-${var.environment}-high-read-capacity"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "ConsumedReadCapacityUnits"
  namespace           = "AWS/DynamoDB"
  period              = 300
  statistic           = "Maximum"
  threshold           = var.read_capacity * 80
  alarm_description   = "Alerta cuando el consumo de capacidad de lectura supera el 80%"

  dimensions = {
    TableName = var.table_name
  }

  alarm_actions = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  ok_actions    = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  tags = {
    Name        = "ordenes-${var.environment}-high-read-capacity-alarm"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "orders_consumed_write_capacity" {
  alarm_name          = "ordenes-${var.environment}-high-write-capacity"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "ConsumedWriteCapacityUnits"
  namespace           = "AWS/DynamoDB"
  period              = 300
  statistic           = "Maximum"
  threshold           = var.write_capacity * 80
  alarm_description   = "Alerta cuando el consumo de capacidad de escritura supera el 80%"

  dimensions = {
    TableName = var.table_name
  }

  alarm_actions = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  ok_actions    = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  tags = {
    Name        = "ordenes-${var.environment}-high-write-capacity-alarm"
    Environment = var.environment
  }
}

// === ARCHIVO: infra/outputs.tf ===
output "dynamodb_table_name" {
  description = "Nombre de la tabla de DynamoDB para órdenes"
  value       = module.dynamodb.orders_table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla de DynamoDB para órdenes"
  value       = module.dynamodb.orders_table_arn
}

output "dynamodb_table_stream_arn" {
  description = "ARN del stream de DynamoDB para captura de cambios"
  value       = module.dynamodb.orders_table_stream_arn
  depends_on  = [module.dynamodb]
}

output "dynamodb_region" {
  description = "Región donde está desplegada la tabla de DynamoDB"
  value       = var.aws_region
}

output "orders_api_endpoint" {
  description = "Endpoint del API Gateway para acceso a órdenes"
  value       = var.enable_api_gateway ? module.api_gateway.orders_endpoint : "API Gateway deshabilitado"
}

output "lambda_function_name" {
  description = "Nombre de la función Lambda procesadora de órdenes"
  value       = module.lambda.order_processor_function_name
}

output "lambda_function_arn" {
  description = "ARN de la función Lambda procesadora de órdenes"
  value       = module.lambda.order_processor_function_arn
}

output "s3_bucket_orders_documents" {
  description = "Nombre del bucket S3 para almacenamiento de documentos de órdenes"
  value       = aws_s3_bucket.orders_documents.id
}

output "s3_bucket_orders_documents_arn" {
  description = "ARN del bucket S3 para almacenamiento de documentos de órdenes"
  value       = aws_s3_bucket.orders_documents.arn
}

output "iam_role_orders_processor" {
  description = "Nombre del rol IAM para procesamiento de órdenes"
  value       = aws_iam_role.orders_processor.name
}

output "iam_role_orders_processor_arn" {
  description = "ARN del rol IAM para procesamiento de órdenes"
  value       = aws_iam_role.orders_processor.arn
}

output "dynamodb_endpoint" {
  description = "Endpoint de DynamoDB para conexiones locales (desarrollo)"
  value       = var.enable_local_dynamodb ? "http://localhost:8000" : "https://dynamodb.${var.aws_region}.amazonaws.com"
}

output "table_partitions" {
  description = "Distribución de particiones de la tabla"
  value       = module.dynamodb.partition_key_attribute_name
}

output "table_sort_key" {
  description = "Clave de ordenamiento de la tabla"
  value       = module.dynamodb.sort_key_attribute_name
}

output "environment" {
  description = "Ambiente de despliegue"
  value       = var.environment
}

output "tags_applied" {
  description = "Etiquetas aplicadas a todos los recursos"
  value       = var.tags
}

// === ARCHIVO: infra/environments/dev/terraform.tfvars ===
aws_region               = "us-east-1"
environment              = "dev"
environment_short        = "d"

enable_api_gateway       = true
enable_dynamodb_streams  = true
enable_local_dynamodb    = false
enable_cognito           = false

dynamodb_table_name      = "orders-dev"
dynamodb_billing_mode    = "PAY_PER_REQUEST"
dynamodb_read_capacity   = 5
dynamodb_write_capacity  = 5
dynamodb_point_in_time_recovery = false

dynamodb_partition_key   = "orderId"
dynamodb_sort_key        = "createdAt"
dynamodb_gsi_partition_key = "customerId"
dynamodb_gsi_sort_key    = "status"

enable_dynamodb_autoscaling = false
dynamodb_min_read_capacity  = 5
dynamodb_max_read_capacity  = 100
dynamodb_min_write_capacity = 5
dynamodb_max_write_capacity = 100

lambda_function_name     = "order-processor-dev"
lambda_runtime           = "nodejs20.x"
lambda_memory_size       = 256
lambda_timeout           = 30
lambda_ephemeral_storage = 512

s3_bucket_name           = "orders-documents-dev"
s3_versioning_enabled    = false
s3_lifecycle_rule_enabled = false
s3_lifecycle_expiration_days = 90

api_gateway_stage_name  = "dev"
api_gateway_throttling_rate = 100
api_gateway_throttling_burst = 200

cognito_user_pool_name  = "orders-pool-dev"
cognito_mfa_enabled     = false
cognito_password_policy_minimum_length = 8

tags = {
  Environment     = "dev"
  Project         = "orders-management"
  ManagedBy       = "terraform"
  CostCenter      = "engineering"
  Team            = "platform"
  Compliance      = "internal"
  DataClassification = "internal"
  Owner           = "platform-team@company.com"
  SupportContact  = "oncall@company.com"
}

allowed_cidr_blocks     = ["10.0.0.0/8", "172.16.0.0/12"]
allowed_vpc_id          = "vpc-dev-primary"
allowed_security_groups = ["sg-dev-api", "sg-dev-lambda"]

cloudwatch_log_retention_days = 7
cloudwatch_dashboard_enabled  = false

backup_enabled          = false
backup_schedule         = "cron(0 5 ? * * *)"
backup_retention_days   = 30

enable_vpc_endpoint     = false
vpc_id                  = "vpc-dev-primary"
private_subnet_ids      = ["subnet-dev-1a", "subnet-dev-1b"]

kms_key_arn             = ""
enable_server_side_encryption = true

force_destroy_s3        = true
enable_access_logging   = false
s3_access_log_bucket    = ""

enable_waf              = false
waf_rules = []

monitoring_enabled      = false
alarm_email             = ""
enable_xray             = false

enable_trusted_advisor  = false
trusted_advisor_checks  = []

resource_naming_prefix  = "orders-dev"
enable_cost_allocation_tags = true

// === ARCHIVO: infra/modules/dynamodb/main.tf ===
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31"
    }
  }
}

resource "aws_dynamodb_table" "orders" {
  name           = var.table_name
  billing_mode   = var.billing_mode
  hash_key       = "order_id"
  range_key      = "customer_id"

  attribute {
    name = "order_id"
    type = "S"
  }

  attribute {
    name = "customer_id"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "created_at"
    type = "S"
  }

  attribute {
    name = "updated_at"
    type = "S"
  }

  global_secondary_index {
    name            = "status_created_index"
    hash_key        = "status"
    range_key       = "created_at"
    projection_type = "ALL"
    read_capacity   = var.gsi_read_capacity
    write_capacity  = var.gsi_write_capacity
  }

  global_secondary_index {
    name            = "customer_status_index"
    hash_key        = "customer_id"
    range_key       = "status"
    projection_type = "ALL"
    read_capacity   = var.gsi_read_capacity
    write_capacity  = var.gsi_write_capacity
  }

  local_secondary_index {
    name            = "customer_created_index"
    range_key       = "created_at"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  ttl {
    attribute_name = "expires_at"
    enabled        = var.enable_ttl
  }

  server_side_encryption {
    enabled     = var.enable_encryption
    kms_key_arn = var.kms_key_arn
  }

  stream_enabled   = var.enable_streams
  stream_view_type = var.stream_view_type

  tags = merge(
    var.tags,
    {
      "Name"        = var.table_name
      "Environment" = var.environment
      "Component"   = "orders"
      "ManagedBy"   = "terraform"
    }
  )

  lifecycle {
    prevent_destroy = var.prevent_destroy
    ignore_changes = [
      tags["Env"],
      tags["Team"]
    ]
  }
}

resource "aws_dynamodb_table_item" "seed_orders" {
  count = length(var.seed_orders) > 0 ? length(var.seed_orders) : 0

  table_name = aws_dynamodb_table.orders.name
  hash_key   = aws_dynamodb_table.orders.hash_key

  item = jsonencode(var.seed_orders[count.index])

  lifecycle {
    ignore_changes = [item]
  }
}

resource "aws_appautoscaling_target" "orders_read_target" {
  count = var.billing_mode == "PROVISIONED" && var.enable_autoscaling ? 1 : 0

  max_capacity       = var.max_read_capacity
  min_capacity       = var.min_read_capacity
  resource_id        = "table/${aws_dynamodb_table.orders.name}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "orders_read_policy" {
  count = var.billing_mode == "PROVISIONED" && var.enable_autoscaling ? 1 : 0

  name               = "orders_read_scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.orders_read_target[0].resource_id
  scalable_dimension = aws_appautoscaling_target.orders_read_target[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.orders_read_target[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = var.target_read_utilization
  }
}

resource "aws_appautoscaling_target" "orders_write_target" {
  count = var.billing_mode == "PROVISIONED" && var.enable_autoscaling ? 1 : 0

  max_capacity       = var.max_write_capacity
  min_capacity       = var.min_write_capacity
  resource_id        = "table/${aws_dynamodb_table.orders.name}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "orders_write_policy" {
  count = var.billing_mode == "PROVISIONED" && var.enable_autoscaling ? 1 : 0

  name               = "orders_write_scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.orders_write_target[0].resource_id
  scalable_dimension = aws_appautoscaling_target.orders_write_target[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.orders_write_target[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = var.target_write_utilization
  }
}

resource "aws_dynamodb_contributor_insights" "orders_insights" {
  count = var.enable_contributor_insights ? 1 : 0

  table_name = aws_dynamodb_table.orders.name
  status     = "ENABLED"
}

resource "aws_ssm_parameter" "dynamodb_table_name" {
  count = var.store_table_name_in_ssm ? 1 : 0

  name        = "/${var.environment}/dynamodb/orders/table-name"
  description = "DynamoDB table name for orders"
  type        = "String"
  value       = aws_dynamodb_table.orders.name
  tier        = "Standard"

  tags = var.tags
}

resource "aws_ssm_parameter" "dynamodb_table_arn" {
  count = var.store_table_name_in_ssm ? 1 : 0

  name        = "/${var.environment}/dynamodb/orders/table-arn"
  description = "DynamoDB table ARN for orders"
  type        = "String"
  value       = aws_dynamodb_table.orders.arn
  tier        = "Standard"

  tags = var.tags
}

resource "aws_kms_grant" "orders_table_grant" {
  count = var.enable_encryption && var.use_kms_grant ? 1 : 0

  name        = "orders_dynamodb_kms_grant"
  key_id      = var.kms_key_arn
  grantee_principal = var.grantee_principal
  operations  = ["Encrypt", "Decrypt", "ReEncryptFrom", "GenerateDataKey"]
  constraint_constraint = "AWS:KMS:ContextEncryptionScheme=${var.kms_context_scheme}"
  constraint_key_ids = [var.kms_key_arn]
  valid_from = var.grant_valid_from
}

output "table_name" {
  description = "Nombre de la tabla de DynamoDB para órdenes"
  value       = aws_dynamodb_table.orders.name
}

output "table_arn" {
  description = "ARN de la tabla de DynamoDB para órdenes"
  value       = aws_dynamodb_table.orders.arn
}

output "table_id" {
  description = "ID de la tabla de DynamoDB para órdenes"
  value       = aws_dynamodb_table.orders.id
}

output "stream_arn" {
  description = "ARN del stream de la tabla de DynamoDB"
  value       = var.enable_streams ? aws_dynamodb_table.orders.stream_arn : null
  sensitive   = false
}

output "table_size_bytes" {
  description = "Tamaño actual de la tabla en bytes"
  value       = aws_dynamodb_table.orders.table_size_bytes
}

output "item_count" {
  description = "Cantidad de items en la tabla"
  value       = aws_dynamodb_table.orders.item_count
}

output "billing_mode" {
  description = "Modo de facturación de la tabla"
  value       = aws_dynamodb_table.orders.billing_mode
}

output "read_capacity" {
  description = "Capacidad de lectura configurada"
  value       = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
}

output "write_capacity" {
  description = "Capacidad de escritura configurada"
  value       = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
}

output "gsi_names" {
  description = "Nombres de los índices secundarios globales"
  value       = [for gsi in aws_dynamodb_table.orders.global_secondary_index : gsi.name]
}

output "lsi_names" {
  description = "Nombres de los índices secundarios locales"
  value       = [for lsi in aws_dynamodb_table.orders.local_secondary_index : lsi.name]
}

output "ssm_parameter_names" {
  description = "Parámetros de SSM creados para la tabla"
  value       = var.store_table_name_in_ssm ? [aws_ssm_parameter.dynamodb_table_name[0].name, aws_ssm_parameter.dynamodb_table_arn[0].name] : []
  sensitive   = false
}

output "contributor_insights_status" {
  description = "Estado de Contributor Insights"
  value       = var.enable_contributor_insights ? aws_dynamodb_contributor_insights.orders_insights[0].status : "DISABLED"
}

output "kms_key_id_used" {
  description = "ID de la clave KMS utilizada para el cifrado"
  value       = var.enable_encryption ? var.kms_key_arn : null
  sensitive   = false
}

output "autoscaling_enabled" {
  description = "Indica si el autoescalado está habilitado"
  value       = var.enable_autoscaling
}

output "environment" {
  description = "Entorno donde está desplegada la tabla"
  value       = var.environment
}

output "tags_applied" {
  description = "Etiquetas aplicadas a la tabla"
  value       = aws_dynamodb_table.orders.tags
  sensitive   = false
}

// === ARCHIVO: infra/modules/dynamodb/outputs.tf ===
output "table_name" {
  description = "Nombre de la tabla de órdenes en DynamoDB"
  value       = aws_dynamodb_table.orders.name
}

output "table_arn" {
  description = "ARN de la tabla de órdenes en DynamoDB"
  value       = aws_dynamodb_table.orders.arn
}

output "table_id" {
  description = "ID de la tabla de órdenes en DynamoDB"
  value       = aws_dynamodb_table.orders.id
}

output "table_stream_arn" {
  description = "ARN del stream de DynamoDB para captura de cambios en tiempo real"
  value       = try(aws_dynamodb_table.orders.stream_arn, null)
}

output "table_stream_label" {
  description = "Etiqueta del stream de DynamoDB para sincronización de eventos"
  value       = try(aws_dynamodb_table.orders.stream_label, null)
}

output "table_endpoint" {
  description = "Endpoint de la tabla de DynamoDB para conexiones directas"
  value       = "https://dynamodb.${var.region}.amazonaws.com"
}

output "partition_key_attribute_name" {
  description = "Nombre del atributo de clave de partición"
  value       = aws_dynamodb_table.orders.hash_key
}

output "sort_key_attribute_name" {
  description = "Nombre del atributo de clave de ordenación"
  value       = try(aws_dynamodb_table.orders.range_key, null)
}

output "regional_endpoint" {
  description = "Endpoint regional de DynamoDB para la tabla"
  value       = "dynamodb.${var.region}.amazonaws.com"
}

output "table_items_count" {
  description = "Cantidad de ítems en la tabla (solo lectura si existe)"
  value       = try(aws_dynamodb_table.orders.item_count, 0)
  sensitive   = false
}

output "table_size_bytes" {
  description = "Tamaño de la tabla en bytes"
  value       = try(aws_dynamodb_table.orders.table_size_bytes, 0)
  sensitive   = false
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:2.5.2"
    command: ["-jar","DynamoDBLocal.jar","-sharedDb","-inMemory"]
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD-SHELL","bash -c ':> /dev/tcp/127.0.0.1/8000' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 5s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| DynamoDB Local | `amazon/dynamodb-local:2.5.2` | 8000 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/dynamodb/create-tables.sh ===
#!/usr/bin/env bash
# Crea las tablas en DynamoDB Local (idempotente). Credenciales dummy: DynamoDB Local no valida firmas.
set -euo pipefail

export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=us-east-1
ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

create_table() {
  local name="$1" pk="$2" sk="${3:-}"
  if aws dynamodb describe-table --table-name "$name" --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    echo "Tabla $name ya existe"
    return
  fi
  local attrs="AttributeName=$pk,AttributeType=S"
  local keys="AttributeName=$pk,KeyType=HASH"
  if [ -n "$sk" ]; then
    attrs="$attrs AttributeName=$sk,AttributeType=S"
    keys="$keys AttributeName=$sk,KeyType=RANGE"
  fi
  # shellcheck disable=SC2086
  aws dynamodb create-table --table-name "$name" --attribute-definitions $attrs --key-schema $keys \
    --billing-mode PAY_PER_REQUEST --endpoint-url "$ENDPOINT" >/dev/null
  echo "Tabla $name creada"
}

create_table "app-items" "id"

```

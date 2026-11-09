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
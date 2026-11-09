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
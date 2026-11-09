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
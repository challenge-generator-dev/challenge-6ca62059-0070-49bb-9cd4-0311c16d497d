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
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
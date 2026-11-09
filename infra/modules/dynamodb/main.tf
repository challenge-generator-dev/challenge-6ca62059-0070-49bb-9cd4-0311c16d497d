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
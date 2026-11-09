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
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
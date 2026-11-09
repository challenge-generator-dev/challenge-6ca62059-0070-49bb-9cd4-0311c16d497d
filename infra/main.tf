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
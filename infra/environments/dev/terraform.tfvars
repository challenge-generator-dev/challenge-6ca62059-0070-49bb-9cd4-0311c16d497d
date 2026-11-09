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
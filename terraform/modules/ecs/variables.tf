variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnets" {
  description = "Public subnets for ALB"
  type        = list(string)
}

variable "backend_sg_id" {
  description = "Security Group ID for Backend ECS tasks"
  type        = string
}

variable "frontend_sg_id" {
  description = "Security Group ID for Frontend ECS tasks"
  type        = string
}

variable "rds_endpoint" {
  description = "RDS Endpoint for backend"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

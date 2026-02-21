variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "backend_port" {
  description = "Port for the backend service"
  type        = number
  default     = 8080
}

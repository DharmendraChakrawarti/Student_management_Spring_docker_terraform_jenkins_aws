terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "us-east-1"
}

variable "db_password" {
  description = "RDS root password"
  type        = string
  sensitive   = true
}

module "vpc" {
  source = "./modules/vpc"
}

module "security_groups" {
  source = "./modules/security_groups"
  vpc_id = module.vpc.vpc_id
}

module "rds" {
  source      = "./modules/rds"
  subnet_ids  = module.vpc.public_subnet_ids
  rds_sg_id   = module.security_groups.rds_sg_id
  db_password = var.db_password
}

module "ecs" {
  source         = "./modules/ecs"
  vpc_id         = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnet_ids
  backend_sg_id  = module.security_groups.backend_sg_id
  alb_sg_id      = module.security_groups.alb_sg_id
}

output "alb_dns_name" {
  value = module.ecs.alb_dns_name
}

output "rds_endpoint" {
  value = module.rds.db_endpoint
}

output "ecr_backend_url" {
  value = module.ecs.ecr_backend_url
}

output "ecr_frontend_url" {
  value = module.ecs.ecr_frontend_url
}

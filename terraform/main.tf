terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = "Production"
      ManagedBy   = "Terraform"
    }
  }
}

# Data source for Availability Zones
data "aws_availability_zones" "available" {
  state = "available"
}

module "vpc" {
  source             = "./modules/vpc"
  project_name       = var.project_name
  vpc_cidr           = var.vpc_cidr
  public_subnets     = var.public_subnets
  availability_zones = slice(data.aws_availability_zones.available.names, 0, 2)
}

module "security_groups" {
  source       = "./modules/security_groups"
  project_name = var.project_name
  vpc_id       = module.vpc.vpc_id
}

module "rds" {
  source       = "./modules/rds"
  project_name = var.project_name
  subnet_ids   = module.vpc.public_subnet_ids
  rds_sg_id    = module.security_groups.rds_sg_id
  db_password  = var.db_password
}

module "ecs" {
  source         = "./modules/ecs"
  project_name   = var.project_name
  vpc_id         = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnet_ids
  backend_sg_id  = module.security_groups.backend_sg_id
  alb_sg_id      = module.security_groups.alb_sg_id
}

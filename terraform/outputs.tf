output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "rds_endpoint" {
  description = "The database endpoint"
  value       = module.rds.db_endpoint
}

output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = module.ecs.alb_dns_name
}

output "ecr_backend_url" {
  description = "The URL of the backend ECR repository"
  value       = module.ecs.ecr_backend_url
}

output "ecr_frontend_url" {
  description = "The URL of the frontend ECR repository"
  value       = module.ecs.ecr_frontend_url
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = module.ecs.ecs_cluster_name
}

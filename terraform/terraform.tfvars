aws_region     = "ap-south-1"
project_name   = "sms-project"
vpc_name       = "sms-vpc"
vpc_cidr       = "10.0.0.0/16"
public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
# db_password is provided by Jenkins credentials

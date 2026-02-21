variable "subnet_ids" {
  type = list(string)
}

variable "rds_sg_id" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

resource "aws_db_subnet_group" "main" {
  name       = "student-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "Student DB Subnet Group"
  }
}

resource "aws_db_instance" "mysql" {
  identifier           = "student-db"
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  db_name              = "student_db"
  username             = "admin"
  password             = var.db_password
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
  publicly_accessible  = true # Set to false in production
  vpc_security_group_ids = [var.rds_sg_id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  tags = {
    Name = "student-db-instance"
  }
}

output "db_endpoint" {
  value = aws_db_instance.mysql.endpoint
}

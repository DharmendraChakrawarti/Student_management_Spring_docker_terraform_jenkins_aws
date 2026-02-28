# 🎓 Student Management System — Full Stack DevOps Project

A production-ready **Student Management System** with a complete DevOps pipeline.
Built with **Spring Boot + React**, containerized with **Docker**, deployed on **AWS** using **Terraform** and automated with **Jenkins CI/CD**.

---

## 🚀 Tech Stack

| Layer          | Technology                                      |
|----------------|------------------------------------------------|
| **Backend**    | Spring Boot 3.2, Spring Security, JPA, JWT     |
| **Frontend**   | React 19, Vite, Bootstrap 5, Axios             |
| **Database**   | MySQL 8.0 (Docker local / AWS RDS production)  |
| **Containers** | Docker, Docker Compose                         |
| **Cloud**      | AWS (EC2, VPC, RDS, ECR)                       |
| **IaC**        | Terraform (Modular)                            |
| **CI/CD**      | Jenkins (Pipeline-as-Code)                     |

---

## 📁 Project Structure

```
full_stack/
├── student-management-backend/     # Spring Boot API
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── student-management-frontend/    # React SPA
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── terraform/                      # AWS Infrastructure as Code
│   ├── main.tf                     # Root: wires all modules
│   ├── variables.tf                # All input variables
│   ├── outputs.tf                  # Output values after apply
│   ├── provider.tf                 # AWS provider config
│   ├── terraform.tfvars.example    # Example values (copy to terraform.tfvars)
│   └── modules/
│       ├── vpc/                    # VPC, Subnets, IGW, Route Tables
│       ├── security/               # Security Groups (EC2, RDS)
│       ├── ecr/                    # Docker Image Repositories
│       ├── rds/                    # MySQL RDS Instance
│       └── ec2/                    # Application Server + User Data
├── docker-compose.yml              # Local dev (3 containers)
├── docker-compose-aws.yml          # AWS RDS deployment
├── Jenkinsfile                     # CI/CD Pipeline
└── README.md                       # You are here!
```

---

## 📋 COMPLETE STEP-BY-STEP GUIDE

### What We're Going to Do

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT FLOW                             │
│                                                                 │
│  1. Test locally  →  Docker Compose (3 containers)              │
│  2. Create AWS    →  Terraform (VPC + EC2 + RDS + ECR)          │
│  3. Build & Push  →  Docker images → AWS ECR                    │
│  4. Deploy        →  EC2 pulls images, connects to RDS          │
│  5. Automate      →  Jenkins runs steps 2-4 automatically       │
└─────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: Local Testing (Docker Compose)

### Step 1.1 — Run the Full Stack Locally

```bash
# Build and start all 3 containers (MySQL + Backend + Frontend)
docker compose up --build -d

# Check all containers are running
docker ps

# Expected output:
# student-frontend  → 0.0.0.0:3000->80/tcp
# student-backend   → 0.0.0.0:8080->8080/tcp
# mysql-db          → 0.0.0.0:3306->3306/tcp
```

### Step 1.2 — Access the App

- **App URL:** http://localhost:3000
- **Default Login:** `admin` / `admin`

### Step 1.3 — Stop the Containers

```bash
docker compose down -v   # -v removes the MySQL data volume too
```

---

## PHASE 2: AWS Infrastructure (Terraform)

### Step 2.1 — Prerequisites

Before starting, make sure you have:

| Tool       | How to Check     | Install From                                   |
|------------|------------------|-------------------------------------------------|
| AWS CLI    | `aws --version`  | https://aws.amazon.com/cli/                     |
| Terraform  | `terraform -v`   | https://developer.hashicorp.com/terraform       |
| Docker     | `docker -v`      | https://www.docker.com/                         |

### Step 2.2 — Configure AWS CLI

```bash
aws configure
# Enter your:
#   AWS Access Key ID:     AKIA...
#   AWS Secret Access Key: xxxxxxx
#   Default region:        ap-south-1
#   Output format:         json
```

### Step 2.3 — Create SSH Key Pair in AWS

```bash
# Create a new key pair (save the .pem file safely!)
aws ec2 create-key-pair \
  --key-name student-mgmt-key \
  --query 'KeyMaterial' \
  --output text \
  --region ap-south-1 > student-mgmt-key.pem

# Set permissions (Linux/Mac)
chmod 400 student-mgmt-key.pem
```

### Step 2.4 — Create terraform.tfvars

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
aws_region   = "ap-south-1"
project_name = "student-mgmt"
environment  = "dev"

ec2_instance_type = "t2.micro"
ec2_key_name      = "student-mgmt-key"    # The key pair you just created

db_instance_class = "db.t3.micro"
db_name           = "student_db"
db_username       = "admin"
db_password       = "YourSecurePassword123!"  # CHANGE THIS!
```

### Step 2.5 — Deploy Infrastructure

```bash
cd terraform

# Initialize Terraform (downloads AWS provider)
terraform init

# Preview what will be created
terraform plan

# Create everything! (takes ~10-15 minutes, RDS is slow)
terraform apply

# Type 'yes' when prompted
```

### Step 2.6 — Note the Outputs

After `terraform apply`, you'll see:
```
ec2_public_ip    = "13.xxx.xxx.xxx"
rds_endpoint     = "student-mgmt-dev-mysql.xxxxxx.ap-south-1.rds.amazonaws.com:3306"
ecr_backend_url  = "123456789.dkr.ecr.ap-south-1.amazonaws.com/student-mgmt-backend"
ecr_frontend_url = "123456789.dkr.ecr.ap-south-1.amazonaws.com/student-mgmt-frontend"
app_url          = "http://13.xxx.xxx.xxx:3000"
ssh_command      = "ssh -i <your-key.pem> ec2-user@13.xxx.xxx.xxx"
```

**Save these values!** You'll need them for the next steps.

---

## PHASE 3: Build & Deploy Manually (First Time)

### Step 3.1 — Push Docker Images to ECR

```bash
# Get your AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="ap-south-1"

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push Backend
cd student-management-backend
docker build -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/student-mgmt-backend:latest .
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/student-mgmt-backend:latest

# Build and push Frontend
cd ../student-management-frontend
docker build -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/student-mgmt-frontend:latest .
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/student-mgmt-frontend:latest
```

### Step 3.2 — SSH into EC2 and Start the App

```bash
# SSH into your EC2 instance
ssh -i student-mgmt-key.pem ec2-user@<EC2_PUBLIC_IP>

# On EC2: Check if Docker is running
sudo systemctl status docker

# On EC2: Navigate to app directory
cd /home/ec2-user/app

# On EC2: Pull latest images from ECR
docker-compose pull

# On EC2: Start the application
docker-compose up -d

# On EC2: Check containers
docker ps
```

### Step 3.3 — Access Your App on AWS!

Open in browser: `http://<EC2_PUBLIC_IP>:3000`

Login with: `admin` / `admin`

---

## PHASE 4: Jenkins CI/CD (Automation)

### Step 4.1 — Install Jenkins

```bash
# Option A: Run Jenkins in Docker (easiest)
docker run -d \
  --name jenkins \
  -p 8081:8080 \
  -v jenkins_data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts

# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Step 4.2 — Configure Jenkins

1. **Open Jenkins:** http://localhost:8081
2. **Install Suggested Plugins** + these additional:
   - Pipeline
   - SSH Agent
   - AWS Credentials
   - NodeJS Plugin
3. **Global Tool Configuration** (`Manage Jenkins → Tools`):
   - **Maven:** Name = `Maven-3.9`, Install automatically
   - **NodeJS:** Name = `Node-20`, Version = 20.x
4. **Add Credentials** (`Manage Jenkins → Credentials`):

| Credential ID   | Type             | Value                              |
|-----------------|------------------|------------------------------------|
| `aws-credentials` | AWS Credentials | Your Access Key + Secret Key       |
| `rds-password`   | Secret text     | Your RDS password                  |
| `ec2-ssh-key`    | SSH Private Key | Contents of `student-mgmt-key.pem` |

### Step 4.3 — Create Pipeline Job

1. **New Item** → Name: `student-mgmt-pipeline` → **Pipeline**
2. **Pipeline** section:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/DharmendraChakrawarti/Student_management_Spring_docker_terraform_jenkins_aws.git`
   - Script Path: `Jenkinsfile`
3. **Save** and **Build Now**!

### Step 4.4 — Pipeline Stages

```
┌───────────┐   ┌──────────┐   ┌───────────┐   ┌─────────┐   ┌──────────────┐   ┌──────────┐
│ Checkout  │──→│ AWS Setup│──→│ Terraform │──→│  Build  │──→│ Docker Push  │──→│  Deploy  │
│           │   │          │   │           │   │ Backend │   │   to ECR     │   │  to EC2  │
│ Git Pull  │   │ Get ID   │   │ VPC+EC2   │   │Frontend │   │              │   │  via SSH │
│           │   │          │   │ RDS+ECR   │   │(parallel)│  │              │   │          │
└───────────┘   └──────────┘   └───────────┘   └─────────┘   └──────────────┘   └──────────┘
```

---

## PHASE 5: Cleanup (IMPORTANT — Avoid AWS Charges!)

```bash
cd terraform

# Destroy ALL AWS resources
terraform destroy

# Type 'yes' to confirm
```

This removes: EC2, RDS, VPC, ECR repos, Security Groups — everything.

---

## 🏗️ Architecture Diagram

```
                                    AWS Cloud (ap-south-1)
┌──────────────────────────────────────────────────────────────────────┐
│                           VPC (10.0.0.0/16)                         │
│                                                                      │
│   ┌──────────────── Public Subnets ────────────────┐                │
│   │                                                 │                │
│   │   ┌─────────────────────────────────────┐       │                │
│   │   │         EC2 (t2.micro)              │       │                │
│   │   │                                     │       │                │
│   │   │  ┌──────────┐  ┌──────────────┐    │       │                │
│   │   │  │ Frontend │  │   Backend    │    │       │                │
│   │   │  │ (Nginx)  │──│ (Spring Boot)│────────────────┐            │
│   │   │  │ :3000    │  │   :8080      │    │       │   │            │
│   │   │  └──────────┘  └──────────────┘    │       │   │            │
│   │   └─────────────────────────────────────┘       │   │            │
│   └─────────────────────────────────────────────────┘   │            │
│                                                          │            │
│   ┌──────────────── Private Subnets ───────────────┐    │            │
│   │                                                 │    │            │
│   │   ┌─────────────────────────────────────┐       │    │            │
│   │   │     RDS MySQL (db.t3.micro)         │◄──────┘    │            │
│   │   │     student_db                      │            │            │
│   │   └─────────────────────────────────────┘            │            │
│   └──────────────────────────────────────────────────────┘            │
│                                                                       │
│   ┌──── ECR ────┐                                                    │
│   │  Backend    │  ← Docker images stored here                       │
│   │  Frontend   │                                                    │
│   └─────────────┘                                                    │
└──────────────────────────────────────────────────────────────────────┘
         ▲                              ▲
         │ SSH (:22)                    │ HTTP (:3000, :8080)
         │                              │
    ┌────┴──────┐                 ┌─────┴─────┐
    │  Jenkins  │                 │  Browser   │
    │  Server   │                 │  (Users)   │
    └───────────┘                 └───────────┘
```

---

## 🔐 Security & Roles

| Role      | Permissions                                        |
|-----------|----------------------------------------------------|
| **ADMIN** | Full access — manage Students, Teachers, Courses   |
| **TEACHER** | View Students, manage Courses                    |
| **STUDENT** | Browse Courses, view Dashboard                   |

**Default Admin:** `admin` / `admin`

---

## 💡 Key Terraform Concepts Used

| Concept           | Where Used                            | What It Does                              |
|-------------------|---------------------------------------|-------------------------------------------|
| **Modules**       | `terraform/modules/*`                 | Reusable, isolated infrastructure pieces  |
| **Variables**      | `variables.tf`                       | Configurable inputs (region, size, etc.)  |
| **Outputs**        | `outputs.tf`                         | Values shown after `terraform apply`      |
| **Data Sources**   | `data "aws_ami"`                     | Looks up latest Amazon Linux AMI          |
| **templatefile()** | EC2 `user_data.sh`                   | Injects variables into shell script       |
| **Sensitive vars** | `db_password`                        | Marked sensitive, hidden in logs          |
| **count**          | `aws_subnet.public`                  | Creates multiple resources from a list    |
| **depends_on**     | Implicit via module wiring           | Ensures correct creation order            |
| **Remote State**   | `backend "s3"` (commented)           | Shared state for team/Jenkins             |

---

## ⚠️ AWS Free Tier Notes

| Resource   | Free Tier Limit              | Our Config              |
|------------|------------------------------|-------------------------|
| EC2        | 750 hrs/month t2.micro       | `t2.micro` ✅           |
| RDS        | 750 hrs/month db.t3.micro    | `db.t3.micro` ✅        |
| ECR        | 500 MB storage               | ~300 MB (2 images) ✅   |
| Data out   | 100 GB/month                 | Minimal ✅              |

> **⚠️ Always run `terraform destroy` when not using the infrastructure to avoid charges!**

---

## 🔗 Repository

[https://github.com/DharmendraChakrawarti/Student_management_Spring_docker_terraform_jenkins_aws.git](https://github.com/DharmendraChakrawarti/Student_management_Spring_docker_terraform_jenkins_aws.git)

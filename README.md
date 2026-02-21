# Student Management System (Full Stack)

A professional, production-ready Student Management System built with a modern tech stack, fully containerized, and automated with CI/CD.

## 🚀 Tech Stack

*   **Backend:** Spring Boot (Java 17), Spring Security, JPA, Hibernate, JWT.
*   **Frontend:** React (Vite), Bootstrap 5, Axios.
*   **Infrastructure:** Terraform (AWS VPC, RDS MySQL, ECS Fargate, ALB, ECR).
*   **DevOps:** Docker, Docker Compose, Jenkins (Pipeline-as-Code).
*   **Database:** MySQL (AWS RDS / Local Docker), H2 (Local Development).

---

## 📁 Project Structure

```text
├── student-management-backend/  # Spring Boot Application
├── student-management-frontend/ # React Application
├── terraform/                   # AWS Infrastructure as Code
├── Jenkinsfile                  # CI/CD Pipeline Definition
├── docker-compose.yml           # Local Multi-container Setup
└── README.md                    # You are here!
```

---

## 💻 Local Development

### 1. Run with H2 (Quick Start)
The backend defaults to H2 in-memory database if no environment variables are provided.
```bash
# Backend
cd student-management-backend
mvn spring-boot:run

# Frontend
cd student-management-frontend
npm install
npm run dev
```

### 2. Run with Docker Compose (Full Stack)
```bash
docker-compose up -d --build
```
Access the app at `http://localhost`.

---

## ☁️ AWS Infrastructure (Terraform)

The infrastructure is modular and managed via Terraform in `ap-south-1` (Mumbai).

### One-Time Setup (Remote State)
Before running Jenkins or Terraform for the first time, create the S3 bucket and DynamoDB table for state tracking:

```powershell
# Create S3 bucket for state
aws s3 mb s3://student-management-tf-state-268271485908 --region ap-south-1

# Create DynamoDB for state locking
aws dynamodb create-table --table-name terraform-lock --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region ap-south-1
```

### Manual Deploy
```bash
cd terraform
terraform init
terraform apply -var="db_password=your_secure_password"
```

---

## ⚙️ Jenkins CI/CD Pipeline

The `Jenkinsfile` automates the entire lifecycle: **Provisioning -> Building -> Containerizing -> Pushing -> Deploying**.

### 1. Required Global Tools
*   **Maven:** Name it `Maven-3.9`
*   **NodeJS:** Name it `Node-20`
*   **Terraform:** Name it `Terraform`

### 2. Required Credentials
*   **`aws-credentials`**: (AWS Credentials) - Access Key and Secret Key for AWS.
*   **`rds-password`**: (Secret text) - Master password for the RDS instance.

### 3. Pipeline Stages
1.  **Checkout:** Pulls code from GitHub.
2.  **Terraform:** Provisions AWS resources (S3 Remote Backend enabled).
3.  **Backend Build:** Packages the Spring Boot JAR.
4.  **Docker Build & Push:** Build images and push to AWS ECR.
5.  **Deploy:** Triggers a rolling update on the ECS Fargate cluster.

---

## 🔐 Security & Roles

*   **ADMIN:** Full access (Manager Students, Teachers, Courses, Academic data).
*   **TEACHER:** View Students, Manage Courses.
*   **STUDENT:** Browse Courses, View Dashboard.

**Default Admin Credentials:**
*   **Username:** `admin`
*   **Password:** `admin`

---

## 🔗 Repository
[https://github.com/DharmendraChakrawarti/Student_management_Spring_docker_terraform_jenkins_aws.git](https://github.com/DharmendraChakrawarti/Student_management_Spring_docker_terraform_jenkins_aws.git)

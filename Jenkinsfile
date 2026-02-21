pipeline {
    agent any

    environment {
        // AWS Configuration
        AWS_REGION      = 'us-east-1'
        AWS_ACCOUNT_ID  = '123456789012' // Replace with your AWS Account ID
        
        // Infrastructure Variables
        TF_VAR_db_password = credentials('rds-password') // Get DB password from Jenkins credentials
        
        // ECS/ECR names
        ECR_BACKEND_URL  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/student-management-backend"
        ECR_FRONTEND_URL = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/student-management-frontend"
        
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    tools {
        maven 'Maven-3.9'
        nodejs 'Node-20'
        terraform 'Terraform' // Configure in Jenkins Global Tool Config
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        // ===== Stage: Infrastructure (Terraform) =====
        stage('Terraform - Provision Infrastructure') {
            when {
                expression { return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' }
            }
            steps {
                echo '🏗️ Provisioning AWS Infrastructure with Terraform...'
                dir('terraform') {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials',
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                    ]]) {
                        bat 'terraform init'
                        bat 'terraform apply -auto-approve'
                        
                        // Extract RDS Endpoint for backend
                        script {
                            env.RDS_ENDPOINT = bat(script: 'terraform output -raw rds_endpoint', returnStdout: true).trim()
                            echo "Database Endpoint: ${env.RDS_ENDPOINT}"
                        }
                    }
                }
            }
        }

        // ===== Stage: Backend Build & Image =====
        stage('Backend - Build Artifact') {
            steps {
                echo '� Building Spring Boot backend...'
                dir('student-management-backend') {
                    bat 'mvn clean package -DskipTests -B'
                }
            }
        }

        stage('Docker - Build & Push Images') {
            when {
                expression { return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' }
            }
            steps {
                echo '� Building and Pushing Docker images...'
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    // Login to ECR
                    bat "aws ecr get-login-password --region %AWS_REGION% | docker login --username AWS --password-stdin %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com"
                    
                    // Backend
                    bat "docker build -t %ECR_BACKEND_URL%:%IMAGE_TAG% -t %ECR_BACKEND_URL%:latest ./student-management-backend"
                    bat "docker push %ECR_BACKEND_URL%:latest"
                    bat "docker push %ECR_BACKEND_URL%:%IMAGE_TAG%"
                    
                    // Frontend
                    bat "docker build -t %ECR_FRONTEND_URL%:%IMAGE_TAG% -t %ECR_FRONTEND_URL%:latest ./student-management-frontend"
                    bat "docker push %ECR_FRONTEND_URL%:latest"
                    bat "docker push %ECR_FRONTEND_URL%:%IMAGE_TAG%"
                }
            }
        }

        // ===== Stage: Deployment =====
        stage('Deploy to ECS') {
            when {
                expression { return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' }
            }
            steps {
                echo '🚀 Updating ECS Services...'
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    // Force deployment to trigger a new Fargate task pull
                    bat "aws ecs update-service --cluster student-management-cluster --service student-backend-service --force-new-deployment --region %AWS_REGION%"
                    bat "aws ecs update-service --cluster student-management-cluster --service student-frontend-service --force-new-deployment --region %AWS_REGION%"
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Pipeline failed! Please check logs.'
        }
        always {
            dir('terraform') {
                // Not cleaning up infra, just workspace
                cleanWs()
            }
        }
    }
}

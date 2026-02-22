// Repository: https://github.com/DharmendraChakrawarti/Student_management_Spring_docker_terraform_jenkins_aws.git
// required Jenkins Credentials:
// 1. 'aws-credentials' (AWS Credentials type) -> AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
// 2. 'rds-password' (Secret text type) -> Password for the RDS instance

pipeline {
    agent any

    environment {
        // AWS Configuration
        AWS_REGION      = 'ap-south-1'
        AWS_ACCOUNT_ID  = '268271485908' // Replace with your AWS Account ID
        
        // Infrastructure Variables
        TF_VAR_db_password = credentials('rds-password') // Get DB password from Jenkins credentials
        
        // ECS/ECR names
        ECR_BACKEND_URL  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/sms-project-backend"
        ECR_FRONTEND_URL = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/sms-project-frontend"
        
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

        // ===== Stage: Cleanup Old State (Temporary Fix for Permissions) =====
        stage('Terraform - Cleanup State') {
            when {
                expression { 
                    return env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'origin/main' || env.BRANCH_NAME == 'master' || env.GIT_BRANCH == 'master' || env.GIT_BRANCH == 'origin/master'
                }
            }
            steps {
                dir('terraform') {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials',
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                    ]]) {
                        sh 'terraform init'
                        // Tell terraform to forget the resources that are causing permission errors
                        sh 'terraform state rm module.ecs.aws_service_discovery_private_dns_namespace.main || true'
                        sh 'terraform state rm module.ecs.aws_service_discovery_service.backend || true'
                        sh 'terraform state rm module.ecs.aws_cloudwatch_log_group.backend || true'
                        sh 'terraform state rm module.ecs.aws_cloudwatch_log_group.frontend || true'
                        sh 'terraform state rm module.ecs.aws_ecs_service.frontend || true'
                        sh 'terraform state rm module.ecs.aws_ecs_service.backend || true'
                        sh 'terraform state rm module.ecs.aws_ecs_task_definition.frontend || true'
                        sh 'terraform state rm module.ecs.aws_ecs_task_definition.backend || true'
                    }
                }
            }
        }

        // ===== Stage: Infrastructure (Terraform) =====
        stage('Terraform - Provision Infrastructure') {
            when {
                expression { 
                    return env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'origin/main' || env.BRANCH_NAME == 'master' || env.GIT_BRANCH == 'master' || env.GIT_BRANCH == 'origin/master'
                }
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
                        sh 'terraform init'
                        sh 'terraform apply -auto-approve'
                        
                        // Extract RDS Endpoint for backend
                        script {
                            env.RDS_ENDPOINT = sh(script: 'terraform output -raw rds_endpoint', returnStdout: true).trim()
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
                    sh 'mvn clean package -DskipTests -B'
                }
            }
        }

        stage('Docker - Build & Push Images') {
            when {
                expression { 
                    return env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'origin/main' || env.BRANCH_NAME == 'master' || env.GIT_BRANCH == 'master' || env.GIT_BRANCH == 'origin/master'
                }
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
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    
                    // Backend
                    sh "docker build -t ${ECR_BACKEND_URL}:${IMAGE_TAG} -t ${ECR_BACKEND_URL}:latest ./student-management-backend"
                    sh "docker push ${ECR_BACKEND_URL}:latest"
                    sh "docker push ${ECR_BACKEND_URL}:${IMAGE_TAG}"
                    
                    // Frontend
                    sh "docker build -t ${ECR_FRONTEND_URL}:${IMAGE_TAG} -t ${ECR_FRONTEND_URL}:latest ./student-management-frontend"
                    sh "docker push ${ECR_FRONTEND_URL}:latest"
                    sh "docker push ${ECR_FRONTEND_URL}:${IMAGE_TAG}"
                }
            }
        }

        // ===== Stage: Deployment =====
        stage('Deploy to ECS') {
            when {
                expression { 
                    return env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'origin/main' || env.BRANCH_NAME == 'master' || env.GIT_BRANCH == 'master' || env.GIT_BRANCH == 'origin/master'
                }
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
                    sh "aws ecs update-service --cluster sms-project-cluster --service sms-project-service --force-new-deployment --region ${AWS_REGION}"
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

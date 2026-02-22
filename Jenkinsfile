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
                    sh "aws ecs update-service --cluster student-management-cluster --service student-management-backend-service --force-new-deployment --region ${AWS_REGION}"
                    sh "aws ecs update-service --cluster student-management-cluster --service student-management-frontend-service --force-new-deployment --region ${AWS_REGION}"
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

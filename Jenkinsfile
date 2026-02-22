pipeline {
    agent any

    environment {
        AWS_REGION      = 'ap-south-1'
        AWS_ACCOUNT_ID  = '268271485908'
        TF_VAR_db_password = credentials('rds-password')
    }

    tools {
        terraform 'Terraform'
    }

    stages {
        stage('🗑️ TOTAL AWS CLEANUP') {
            steps {
                dir('terraform') {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials',
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                    ]]) {
                        echo '🔥 Force cleaning orphaned ECS resources...'
                        // Try to stop any running tasks in the cluster
                        sh "aws ecs list-tasks --cluster sms-project-cluster --region ${AWS_REGION} --output text --query 'taskArns' | xargs -r aws ecs stop-task --cluster sms-project-cluster --region ${AWS_REGION} --task" || true
                        
                        // Delete the services (including the orphans we removed from state)
                        sh "aws ecs delete-service --cluster sms-project-cluster --service sms-project-service --force --region ${AWS_REGION}" || true
                        sh "aws ecs delete-service --cluster sms-project-cluster --service sms-project-backend-service --force --region ${AWS_REGION}" || true
                        sh "aws ecs delete-service --cluster sms-project-cluster --service sms-project-frontend-service --force --region ${AWS_REGION}" || true
                        
                        echo '🧹 Running Terraform Destroy for VPC, RDS, and remaining infrastructure...'
                        sh 'terraform init'
                        sh 'terraform destroy -auto-approve'

                        echo '✅ Cleanup complete. All known resources should now be deleting.'
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}

pipeline {
    agent any

    environment {
        // Name your Docker image and container
        IMAGE_NAME = "chad-bot"
        CONTAINER_NAME = "chad-bot-running"
        
        // This securely fetches your token from Jenkins' built-in Credentials Provider.
        // It injects it directly into the pipeline environment without saving it to a file.
        DISCORD_TOKEN = credentials('CHAD_BOT_DISCORD_TOKEN') 
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling fresh code from repository...'
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building fresh Docker Image with FFmpeg dependencies...'
                // Builds the new image and tags it both with the build number and as 'latest'
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying fresh container to server...'
                
                // 1. Stop and remove the old running container if it exists (fails gracefully with || true if none exists)
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
                
                // 2. Launch the new container
                // -d runs it in the background
                // --restart always turns Chad back on if the server or Docker reboots
                // -e passes the secret token directly into the environment where index.js can see it
                sh "docker run -d --name ${CONTAINER_NAME} --restart always -e DISCORD_TOKEN=${DISCORD_TOKEN} ${IMAGE_NAME}:latest"
                
                echo 'Deployment successful! Chad is online and ready.'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline run completed.'
        }
        failure {
            echo 'Pipeline failed! Check the build console logs above for errors.'
        }
    }
}
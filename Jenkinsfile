pipeline {
    agent any

    environment {
        IMAGE_NAME = 'frontend' // Имя Docker-образа
        CONTAINER_NAME = 'frontend-container' // Имя контейнера
        PORT_MAPPING = '8080:80' // Проброс портов
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Stop and Remove Old Container') {
            steps {
                script {
                    sh """
                        docker stop ${CONTAINER_NAME} 2>/dev/null || true
                        docker rm ${CONTAINER_NAME} 2>/dev/null || true
                    """
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    sh "docker run -d --rm --name ${CONTAINER_NAME} -p ${PORT_MAPPING} ${IMAGE_NAME}"
                }
            }
        }
    }

    post {
        success {
            echo "✅ Развертывание завершено успешно!"
        }
        failure {
            echo "❌ Ошибка при развертывании!"
        }
    }
}

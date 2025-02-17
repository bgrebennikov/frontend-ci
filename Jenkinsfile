pipeline {
    agent any

    environment {
        IMAGE_NAME = 'frontend' // Имя Docker-образа
        CONTAINER_NAME = 'frontend-container' // Основной контейнер
        TEMP_CONTAINER_NAME = 'frontend-container-new' // Временный контейнер
        PORT_MAPPING = '3000:3000' // Проброс портов
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
                    sh "docker build -t ${IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    sh """
                        echo "🚀 Запуск нового контейнера ${TEMP_CONTAINER_NAME}"
                        docker run -d --name ${TEMP_CONTAINER_NAME} -p ${PORT_MAPPING} ${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Switch Traffic') {
            steps {
                script {
                    sh """
                        echo "🛑 Остановка старого контейнера ${CONTAINER_NAME}"
                        docker stop ${CONTAINER_NAME} 2>/dev/null || true
                        docker rm ${CONTAINER_NAME} 2>/dev/null || true

                        echo "🔁 Переключение контейнера"
                        docker rename ${TEMP_CONTAINER_NAME} ${CONTAINER_NAME}
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Развёртывание завершено успешно!"
        }
        failure {
            echo "❌ Ошибка при развертывании, старый контейнер остаётся активным!"
        }
    }
}

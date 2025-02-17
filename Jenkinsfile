pipeline {
    agent any

    environment {
        IMAGE_NAME = 'frontend' // Имя Docker-образа
        CONTAINER_NAME = 'frontend-container' // Имя контейнера
        PORT_MAPPING = '3000:3000' // Проброс портов
        OLD_PORT = '8080' // Старый порт
        TEMP_CONTAINER_NAME = 'frontend-container-new' // Временное имя нового контейнера
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
                    sh "docker run -d --name ${TEMP_CONTAINER_NAME} -p ${PORT_MAPPING} ${IMAGE_NAME}:latest"
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

                        echo "🔁 Переключение на новый контейнер ${TEMP_CONTAINER_NAME} на порту ${OLD_PORT}"

                        # Проверка, существует ли контейнер с таким именем
                        if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}\$"; then
                            echo "Контейнер ${CONTAINER_NAME} уже работает."
                        else
                            echo "Контейнер ${CONTAINER_NAME} не найден, начинаю создание нового."
                            docker network disconnect frontend-network ${TEMP_CONTAINER_NAME} || true
                            docker network connect frontend-network ${TEMP_CONTAINER_NAME}
                            docker run -d --name ${CONTAINER_NAME} -p ${OLD_PORT}:3000 ${IMAGE_NAME}:latest
                        fi
                    """
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

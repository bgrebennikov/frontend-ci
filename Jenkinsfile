pipeline {
    agent any

    environment {
        IMAGE_NAME = 'frontend' // Имя Docker-образа
        CONTAINER_NAME = 'frontend-container' // Текущий контейнер
        TEMP_CONTAINER_NAME = 'frontend-container-new' // Временный контейнер
        OLD_PORT = '3000' // Основной порт
        TEMP_PORT = '3001' // Временный порт для теста
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

        stage('Remove Old Temporary Container') {
            steps {
                script {
                    sh """
                        echo "🛑 Удаление старого временного контейнера ${TEMP_CONTAINER_NAME} (если есть)"
                        docker stop ${TEMP_CONTAINER_NAME} 2>/dev/null || true
                        docker rm ${TEMP_CONTAINER_NAME} 2>/dev/null || true
                    """
                }
            }
        }

        stage('Run New Container on Temporary Port') {
            steps {
                script {
                    sh """
                        echo "🚀 Запуск нового контейнера ${TEMP_CONTAINER_NAME} на порту ${TEMP_PORT}"
                        docker run -d --name ${TEMP_CONTAINER_NAME} -p ${TEMP_PORT}:3000 ${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Wait and Test New Container') {
            steps {
                script {
                    sh """
                        echo "⏳ Ожидание запуска нового контейнера..."
                        sleep 5

                        echo "🔍 Проверка работоспособности нового контейнера..."
                        curl --fail http://localhost:${TEMP_PORT} || (echo "❌ Новый контейнер не отвечает!" && exit 1)
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

                        echo "🔁 Перезапуск нового контейнера на основном порту ${OLD_PORT}"
                        docker stop ${TEMP_CONTAINER_NAME} || true
                        docker rm ${TEMP_CONTAINER_NAME} || true
                        docker run -d --name ${CONTAINER_NAME} -p ${OLD_PORT}:3000 ${IMAGE_NAME}:latest
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

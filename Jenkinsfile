pipeline {
    agent any

    environment {
        IMAGE_NAME = 'frontend'
        CONTAINER_NAME = 'frontend-container'
        TEMP_CONTAINER_NAME = 'frontend-container-new'
        NETWORK_NAME = 'frontend-network'
        PORT_MAPPING_OLD = '3000:3000'
        PORT_MAPPING_NEW = '3001:3000'
    }

    stages {
        stage('Create Network') {
            steps {
                script {
                    sh """
                        echo "🔧 Проверка или создание сети ${NETWORK_NAME}"
                        docker network inspect ${NETWORK_NAME} >/dev/null 2>&1 || docker network create ${NETWORK_NAME}
                    """
                }
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
                        echo "🚀 Запуск нового контейнера ${TEMP_CONTAINER_NAME} на порту 3001"
                        docker run -d --rm --name ${TEMP_CONTAINER_NAME} --network=${NETWORK_NAME} -p ${PORT_MAPPING_NEW} ${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Switch Traffic') {
            steps {
                script {
                    sh """
                        echo "🔁 Переключение контейнера..."

                        # Проверяем, есть ли старый контейнер
                        if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
                            echo "🛑 Остановка старого контейнера ${CONTAINER_NAME}"
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                        fi

                        echo "🔗 Подключение нового контейнера к сети ${NETWORK_NAME}"
                        docker network disconnect ${NETWORK_NAME} ${TEMP_CONTAINER_NAME} || true
                        docker network connect ${NETWORK_NAME} ${TEMP_CONTAINER_NAME}

                        echo "🔄 Переименование контейнера"
                        docker rename ${TEMP_CONTAINER_NAME} ${CONTAINER_NAME}
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

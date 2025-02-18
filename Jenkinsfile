pipeline {
    agent any
    environment {
        DOCKER_IMAGE_NAME = 'frontend-prod'
        DOCKER_IMAGE_TAG = 'latest'  // или можешь использовать Git commit или version
        FRONTEND_CONTAINER_NAME = 'frontend-prod'
        FRONTEND_TEST_CONTAINER_NAME = 'frontend-test'
        NGINX_CONTAINER_NAME = 'nginx'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    echo 'Building Docker image for frontend-prod...'
                    // Сборка нового образа для фронтенда
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                }
            }
        }

        stage('Deploy Green Container') {
            steps {
                script {
                    echo 'Deploying new (green) frontend container...'
                    // Запуск нового контейнера с новым образом (Green)
                    sh """
                    docker run -d --name ${FRONTEND_CONTAINER_NAME}-green --network mynetwork -p 3002:3000 ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                    """
                }
            }
        }

        stage('Update Nginx Config') {
            steps {
                script {
                    echo 'Updating Nginx configuration to point to the new (green) container...'
                    // Обновляем конфигурацию Nginx для направления трафика на новый контейнер (Green)
                    sh """
                    sed -i 's/frontend-prod:3000/${FRONTEND_CONTAINER_NAME}-green:3000/' /etc/nginx/nginx.conf
                    docker exec ${NGINX_CONTAINER_NAME} nginx -s reload
                    """
                }
            }
        }

        stage('Test Green Container') {
            steps {
                script {
                    echo 'Testing new (green) frontend container...'
                    // Можно добавить тесты для проверки работоспособности нового контейнера
                    sh 'curl -f http://localhost'
                }
            }
        }

        stage('Switch Traffic to Green') {
            steps {
                script {
                    echo 'Switching traffic to new (green) frontend container...'
                    // Переключаем трафик на новый контейнер
                    sh """
                    sed -i 's/frontend-prod:3000/${FRONTEND_CONTAINER_NAME}-green:3000/' /etc/nginx/nginx.conf
                    docker exec ${NGINX_CONTAINER_NAME} nginx -s reload
                    """
                }
            }
        }

        stage('Remove Old Container (Blue)') {
            steps {
                script {
                    echo 'Removing old (blue) frontend container...'
                    // Удаляем старый контейнер (Blue)
                    sh "docker rm -f ${FRONTEND_CONTAINER_NAME}"
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    echo 'Cleaning up Docker resources...'
                    // Очистка Docker ресурсов
                    sh 'docker system prune -f'
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}

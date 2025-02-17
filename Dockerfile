FROM node:20-alpine
LABEL authors="Boris"

# Установим рабочую директорию
WORKDIR /app

# Копируем только package.json и package-lock.json (или yarn.lock), чтобы эффективно использовать кэш Docker
COPY package*.json ./

# Устанавливаем зависимости только если они изменились
RUN npm install --production

# Копируем все остальные файлы
COPY . .

# Устанавливаем переменную окружения для типа сборки
ENV BUILD_TYPE="PRODUCTION"

# Строим проект только после установки зависимостей
RUN npm run build

# Открываем порт
EXPOSE 3000

# Команда для старта приложения
CMD ["npm", "start"]

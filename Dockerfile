# Usamos la imagen oficial de Node.js
FROM node:18-alpine

# Creamos y configuramos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos necesarios
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de la aplicación
COPY . .

# Exponemos el puerto en el que corre Next.js
EXPOSE 3000

# Arrancamos el servidor en modo desarrollo
CMD ["npm", "run", "dev"]

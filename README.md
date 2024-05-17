# Iniciar
# Para levantar el proyecto node js 18.14.0
instalar dependencias con npm install
# El servidor se conecta a una base de datos con una instancia en docker
Docker
En caso de presentar un error en la instalación de Docker por la versión wsl2, se debe ejecutar el comando wsl --update, con la finalidad de actualizar la versión de wsl2.
# Una vez instalado docker
ejecutar docker-compose up

# De otra forma crear una tabla en postgreSql con estos datos, presente en el archivo .env  (Opcional si no quieres usar docker)
NODE_ENV=development
PORT=3301
SECRET=secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=haciendola
DEFAULT_PASSWORD=password
SECRET_PASSWORD=10
HOST_FRONT=http://localhost:4200

//CONTRASEÑA DE LA INSTANCIA DE POSTGRESQL  
user:admin@admin.com
password:admin


# Una vez configurada la base de datos
MIGRAMOS LAs TALAS CON : npm run db:migrate
MIGRAMOS EL ARCHIVO EXCEL: npm run db:data

# LEVANTAMOS EL SERVIDOR
npm run dev





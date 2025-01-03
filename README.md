<div align="center">
    <img alt="The main logo of MediManage" width="400" src="client/public/images/medimanage-logo.svg" title="MediManage Logo"/>
</div>

**MediManage** is a full-stack application designed to streamline the management of small clinics. It provides an intuitive interface for handling patient records, scheduling appointments, and overseeing other essential administrative tasks. With its robust features and user-friendly design, MediManage ensures efficient and organized clinic operations. This project was developed with a focus on Java Spring Boot studies. Therefore, the Front End may not be fully implemented.

## 📚 Features

- **Patient Management**: Easily add, update, and manage patient information.
- **Consultation Scheduling**: Schedule and track patient appointments with ease.
- **Prescriptions**: Generate and manage prescriptions PDF files.
- **Secure Authentication**: Protect sensitive data with robust security measures.
- **Reporting and Analytics**: Generate insightful reports to optimize clinic operations.

## 🚀 Built With

### Frontend

The frontend of MediManage is built using modern technologies to ensure a responsive and seamless user experience.

- **Next.js** (`next`): A React framework for server-rendered applications.
- **React** (`react`, `react-dom`): A JavaScript library for building user interfaces.
- **Tailwind CSS** (`tailwindcss`, `@tailwindcss/forms`, `@tailwindcss/typography`): A utility-first CSS framework for rapid UI development.
- **NextAuth.js** (`next-auth`): Authentication for Next.js applications.
- **Zod** (`zod`): A TypeScript-first schema validation library.
- **React Icons** (`react-icons`): Include popular icons in your React projects easily.
- **React Intersection Observer** (`react-intersection-observer`): A React implementation of the Intersection Observer API.
- **React PDF Renderer** (`@react-pdf/renderer`): Create PDF files in React.

### Backend

The backend leverages the power of Spring Boot to provide a scalable and secure foundation for the application.

- **Spring Boot Starter Web** (`spring-boot-starter-web`): Build web applications, including RESTful services.
- **Spring Boot Starter Data JPA** (`spring-boot-starter-data-jpa`): Simplify data persistence with JPA.
- **Spring Boot Starter Security** (`spring-boot-starter-security`): Secure the application with Spring Security.
- **Spring Boot Starter Validation** (`spring-boot-starter-validation`): Provide validation support.
- **PostgreSQL Driver** (`postgresql`): Connect to PostgreSQL databases.
- **H2 Database** (`h2`): An in-memory database for development and testing.
- **Java JWT** (`java-jwt`): JSON Web Token (JWT) creation and verification.
- **ModelMapper** (`modelmapper`): Simplify object mapping.
- **Lombok** (`lombok`): Reduce boilerplate code with annotations.
- **SpringDoc OpenAPI** (`springdoc-openapi-starter-webmvc-ui`, `springdoc-openapi-starter-webflux-ui`): Generate API documentation.
- **Spring Boot DevTools** (`spring-boot-devtools`): Enhance the development experience with automatic restarts.

## 🛠️ Project Setup

### Prerequisites

- **Frontend**:
    - [Node.js](https://nodejs.org/) (v18 or later)
    - [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

- **Backend**:
    - [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Frontend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Barata-Ribeiro/MediManage.git
   cd MediManage/client
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env.local` file in the `client` directory and add the necessary environment variables:

   ```env
   TOKEN_NAME=TOKEN_NAME 
   JWT_BACKEND_SECRET=JWT_RANDOM_KEY 
   NEXT_PUBLIC_INSTITUTION_NAME=CLINIC_PUBLIC_NAME 
   AUTH_SECRET=AUTO_GEN_AUTH_JS_KEY # Added by npx auth. Read more: https://cli.authjs.dev
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

5. **Build for Production**

   ```bash
   npm run build
   npm start
   ```

### Backend Setup

1. **Navigate to the Server Directory**

   ```bash
   cd MediManage/server
   ```

2. **Create `docker-compose.yml`**

   Create a `docker-compose.yml` file in the `server` directory with the following content:

   ```yaml
   name: medimanage-backend

   services:
     medimanage-database:
       image: postgres:latest
       container_name: medimanage-database
       restart: always
       environment:
         POSTGRES_DB: medimanage_db
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
         PGDATA: /var/lib/postgresql/data/pgdata
       ports:
         - "5432:5432"
       volumes:
         - pgdata:/var/lib/postgresql/data

     medimanage-app:
       build: .
       container_name: medimanage-app
       restart: always
       environment:
         DB_ORIGIN: medimanage-database
         DB_PORT: 5432
         DB_NAME: medimanage_db
         DB_USER: postgres
         DB_PASSWORD: postgres
         JWT_SECRET: secret
         CORS_ORIGINS: http://localhost:3000
       ports:
         - "8080:8080"
       depends_on:
         - medimanage-database

   volumes:
     pgdata:
   ```

3. **Create `Dockerfile`**

   Create a `Dockerfile` in the `server` directory with the following content:

   ```dockerfile
   # Build stage
   FROM maven:3.9.9-eclipse-temurin-21 as builder
   LABEL authors="Barata Ribeiro <joaomendesjorge@barataribeiro.com>"
   WORKDIR /app
   COPY src /app/src
   COPY pom.xml /app
   RUN mvn clean package -DskipTests

   # Run stage
   FROM eclipse-temurin:21-jre-alpine
   WORKDIR /app
   COPY --from=builder /app/target/*.jar app.jar
   EXPOSE 8080
   ENTRYPOINT ["java", "-jar", "/app/app.jar", "--spring.profiles.active=production"]
   ```

4. **Configure Environment Variables**

   Ensure the following environment variables are set in the `docker-compose.yml` under the `medimanage-app` service:

   ```yaml
   environment:
     DB_ORIGIN: medimanage-database
     DB_PORT: 5432
     DB_NAME: medimanage_db
     DB_USER: postgres
     DB_PASSWORD: postgres
     JWT_SECRET: secret
     CORS_ORIGINS: http://localhost:3000
   ```

   **Additional Environment Variables:**

    - `CORS_ORIGIN=URLS_SEPARATE_BY_COMMAS`
    - `JWT_SECRET=SECRET_KEY`

5. **Run the Services**

   From the `server` directory, run:

   ```bash
   docker-compose up --build
   ```

   This command will build the backend application and start both the PostgreSQL database and the backend service. The backend will be accessible at [http://localhost:8080](http://localhost:8080).

## 🗂️ Folder Structure

### Client

```
client/
├── .idea
├── node_modules
├── public/
├── src/
│   ├── actions/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── interfaces/
│   ├── utils/
│   ├── auth.ts
│   ├── constants.ts
│   ├── middleware.ts
├── .env.local
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

### Server

```
server/
├── .idea
├── .mvn/
├── src/
│   ├── main/
│       ├── java/
│           └── com/barataribeiro/medimanage/
│               ├── builders/
│               ├── config/
│               ├── constants/
│               ├── controllers/
│               ├── dtos/
│               ├── entities/
│               ├── exceptions/
│               ├── repositories/
│               ├── services/
│               └── MediManageApplication.java
├── target/
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── HELP.md
├── MediManage.iml
├── mvnw
├── mvnw.cmd
└── pom.xml
```

## 🗄️ Environment Variables

### Client `.env.local` Example

```env
TOKEN_NAME=TOKEN_NAME 
JWT_BACKEND_SECRET=JWT_RANDOM_KEY 
NEXT_PUBLIC_INSTITUTION_NAME=CLINIC_PUBLIC_NAME 
AUTH_SECRET=AUTO_GEN_AUTH_JS_KEY # Added by npx auth. Read more: https://cli.authjs.dev
```

### Backend Properties

#### Development (`application-dev.properties`)

```properties
spring.application.name=MediManage
springdoc.api-docs.path=/api-docs
spring.threads.virtual.enabled=true

# Database Configuration
spring.datasource.url=jdbc:h2:file:~/data/medi_manage_db_test
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true

# Security and Seed
api.security.token.secret=${JWT_SECRET}
api.security.cors.origins=${CORS_ORIGINS}
api.security.argon2.salt=${ENCODER_SALT:16}
api.security.argon2.length=${ENCODER_LENGTH:32}
api.security.argon2.parallelism=${ENCODER_PARALLELISM:2}
api.security.argon2.memory=${ENCODER_MEMORY:65536}
api.security.argon2.iterations=${ENCODER_ITERATIONS:4}

# Spring Docs
springdoc.swagger-ui.operationsSorter=alpha
springdoc.swagger-ui.tagsSorter=alpha
```

#### Production (`application-prod.properties`)

```properties
spring.application.name=MediManage
springdoc.api-docs.path=/api-docs
spring.threads.virtual.enabled=true

# Database Configuration
spring.datasource.url=jdbc:postgresql://${DB_ORIGIN:localhost}:${DB_PORT:5432}/${DB_NAME:medi_manage_db}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true

# Security and Seed
api.security.token.secret=${JWT_SECRET}
api.security.cors.origins=${CORS_ORIGINS}
api.security.argon2.salt=${ENCODER_SALT:16}
api.security.argon2.length=${ENCODER_LENGTH:32}
api.security.argon2.parallelism=${ENCODER_PARALLELISM:2}
api.security.argon2.memory=${ENCODER_MEMORY:65536}
api.security.argon2.iterations=${ENCODER_ITERATIONS:4}
```

## 🤝 Contributing 

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Barata-Ribeiro/MediManage/issues) if you want to contribute.

## 📜 License 

This project is free software available under the [GPLv3](LICENSE) license.

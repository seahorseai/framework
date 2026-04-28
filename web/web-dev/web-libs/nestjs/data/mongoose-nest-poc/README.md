# NestJS Product API with MongoDB and Mongo Express

This project is a simple **NestJS API** for managing products, using **MongoDB** as the database and **Mongo Express** for a web-based database management interface. The project is fully containerized using Docker Compose.

---

## 🚀 Features

- CRUD operations for products
- Mongoose ODM for MongoDB
- Mongo Express UI for database browsing
- Docker Compose setup for easy development

---

## 🛠 Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- (Optional) Node.js 18+ for local development

---

## 🔧 Docker Compose Configuration

The `docker-compose.yml` file sets up MongoDB and Mongo Express:

```yaml
version: '3.1'

services:

  mongo:
    image: mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: 1234
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db   # <-- this ensures your data is persisted

  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: 1234
      ME_CONFIG_MONGODB_URL: mongodb://root:1234@mongo:27017/
      ME_CONFIG_BASICAUTH: "false"

networks:
  server-network:

volumes:
  mongo-data:   # <-- named volume declaration

```
## 🚀 Running the Project

Start the services with Docker Compose:

```bash
docker-compose up -d
```



---
### Connection Strings

**MongoDB connection string** for your NestJS app:
```
mongodb://root:1234@localhost:27017/
```

**Mongo Express UI** is accessible at:
```
http://localhost:8081
```

---

## 📮 Run the application


```bash
npm run start
```

---

## 📝 API Endpoints

| Method | Endpoint        | Description           |
|--------|-----------------|---------------------|
| POST   | /products        | Create a new product |
| GET    | /products        | Get all products     |
| GET    | /products/:id    | Get product by ID    |
| PATCH  | /products/:id    | Update product by ID |
| DELETE | /products/:id    | Delete product by ID |

---

## 📮 Create a Product

Use the following `curl` command to create a new product:

```bash
curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-d '{"name": "Product 1", "price": 100, "reference": "REF001"}'
```

---

```bash
curl -X PATCH http://localhost:3000/products/ID-HERE \
-H "Content-Type: application/json" \
-d '{"name": "Updated Product 1", "price": 100, "reference": "REF001"}'
```
---

## 🧹 Stop Docker Services

```bash
docker-compose down
```
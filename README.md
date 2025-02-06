# Project Documentation - REST API with Express.js & MongoDB**

## **Introduction**
This project is a **REST API** built using **Express.js** and integrated with a **MongoDB** database via **Mongoose**. It includes features for managing users and courses, with JWT authentication for secure data access.

---

## **Technologies Used**
- **Node.js** – Runtime environment.
- **Express.js** – Web framework for JavaScript.
- **MongoDB & Mongoose** – NoSQL database and ODM library.
- **JWT (jsonwebtoken)** – Token-based authentication.
- **bcrypt.js** – Password encryption.
- **dotenv** – Environment variable management.
- **morgan** – HTTP request logging.
- **CORS** – Cross-Origin Resource Sharing.

---

## **Project Setup**
1. Install dependencies:
   ```sh
   npm install express mongoose dotenv jsonwebtoken bcryptjs cors morgan express-validator
   ```
2. Create a **.env** file with the following variables:
   ```env
   MONGO_URL=your_mongodb_connection_string
   JSONWEBTOKEN_SECRET_KEY=your_secret_key
   PORT=5000
   ```
3. Start the server:
   ```sh
   node index.js
   ```

---

## **Available Endpoints**

### **1. Course Management**
#### **1.1. Get All Courses**
- **Endpoint:** `GET /api/courses`
- **Authentication:** Not required
- **Description:** Fetch all courses with optional pagination using `limit` and `page` query parameters.
- **Success Response:**
  ```json
  {
    "status": "success",
    "data": { "courses": [...] }
  }
  ```

#### **1.2. Get a Single Course**
- **Endpoint:** `GET /api/courses/:courseId`
- **Authentication:** Not required
- **Description:** Retrieve a specific course by its **ID**.
- **Response if Course Not Found:**
  ```json
  { "msg": "course is not found" }
  ```

#### **1.3. Create a New Course**
- **Endpoint:** `POST /api/courses`
- **Authentication:** Required (JWT Token)
- **Validation:** `title` must have at least 3 characters.
- **Success Response:**
  ```json
  {
    "status": "success",
    "data": { "newCourse": {...} }
  }
  ```

#### **1.4. Update a Course**
- **Endpoint:** `PATCH /api/courses/:courseId`
- **Authentication:** Required (JWT Token)
- **Description:** Update the details of an existing course.

#### **1.5. Delete a Course**
- **Endpoint:** `DELETE /api/courses/:courseId`
- **Authentication:** Required (JWT Token)
- **Description:** Remove a course from the database.

---

### **2. User Management**
#### **2.1. Get All Users**
- **Endpoint:** `GET /api/users`
- **Authentication:** Required (JWT Token)
- **Description:** Retrieve a list of all users, excluding their passwords.

#### **2.2. User Registration**
- **Endpoint:** `POST /api/users/register`
- **Authentication:** Not required
- **Description:** Register a new user by hashing their password and generating a JWT token.
- **Success Response:**
  ```json
  {
    "status": "success",
    "msg": "User registered successfully",
    "data": { "user": {...} }
  }
  ```

#### **2.3. User Login**
- **Endpoint:** `POST /api/users/login`
- **Authentication:** Not required
- **Description:** Validate user credentials and return a JWT token upon success.
- **Error Response if Credentials are Incorrect:**
  ```json
  {
    "status": "ERROR",
    "msg": "password or email not correct"
  }
  ```

---

## **Authentication & Data Protection**
Certain endpoints require **JWT authentication**:
1. The token must be included in the **Authorization Header** of requests.
2. The token is verified using `jsonwebtoken.verify()`.
3. Upon successful verification, access to protected resources is granted.

---

## **Error Handling**
1. **Validation Errors:**
   - Handled using `express-validator`.
   - If validation fails, an array of errors is returned.
2. **Unauthorized Access:**
   - If no token is provided or the token is invalid, a **401 Unauthorized** response is returned.
3. **Resource Not Found:**
   - If a requested course or user does not exist, a **404 Not Found** response is sent.
4. **Handling Unknown Routes:**
   - A **404 Resource Not Found** response is returned for unhandled routes.

---

## **Running the Project**
1. Ensure the **.env** file is configured correctly.
2. Start the server:
   ```sh
   node index.js
   ```
3. Use **Postman** or similar tools to test API requests.

---


# User Management Service

## Overview
The User Management Service is a RESTful API designed to handle user-related operations such as creating, updating, deleting, and retrieving user information. This service is built using Node.js and Express, and it uses SQL (e.g., MySQL, PostgreSQL) as the database.

## Features
- Create a new user
- Retrieve user details
- Update user information
- Delete a user
- List all users

## Prerequisites
- Node.js (v14 or higher)
- SQL Database (e.g., MySQL, PostgreSQL)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/user-management-service.git
    cd user-management-service
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Start the server:
    ```sh
    npm start
    ```

## API Endpoints

### Create a new user
- **URL:** `/users`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "password123"
    }
    ```
- **Response:**
    ```json
    {
        "message": "User created successfully",
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john.doe@example.com"
        }
    }
    ```

### Retrieve user details
- **URL:** `/users/:id`
- **Method:** `GET`
- **Response:**
    ```json
    {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com"
    }
    ```

### Update user information
- **URL:** `/users/:id`
- **Method:** `PUT`
- **Request Body:**
    ```json
    {
        "name": "John Doe",
        "email": "john.doe@example.com"
    }
    ```
- **Response:**
    ```json
    {
        "message": "User updated successfully",
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john.doe@example.com"
        }
    }
    ```

### Delete a user
- **URL:** `/users/:id`
- **Method:** `DELETE`
- **Response:**
    ```json
    {
        "message": "User deleted successfully"
    }
    ```

### List all users
- **URL:** `/users`
- **Method:** `GET`
- **Response:**
    ```json
    [
        {
            "id": "60d0fe4f5311236168a109ca",
            "name": "John Doe",
            "email": "john.doe@example.com"
        },
        {
            "id": "60d0fe4f5311236168a109cb",
            "name": "Jane Doe",
            "email": "jane.doe@example.com"
        }
    ]
    ```


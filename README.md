## main functionalities 
- Express JS
- Middleware Functions
- REST APIs
- CRUD operations 
 
__About__ 
    This documentation describes a simple RESTful API designed for managing user authentication and product inventory. The API includes endpoints for user registration, login, and product management (create, read, update, and delete operations) 
**Dependencies** 
    -express 
        Usage:- Used to create and manage the server, handle routing, and process HTTP requests and responses.
        Installation:- `npm install express --save`
    -bcrypt 
        Usage:- Used for hashing and securely storing user passwords in the database.
        Installation:- `npm install bcrypt --save`
    -jsonwebtoken 
        Usage:- Used to generate JWT tokens for user authentication and to protect routes from unauthorized access.
        Installation:- `npm install jsonwebtoken --save`
    -sqlite 
        Usage:-  Acts as the database for storing user data and product information in a lightweight manner.
        Installation:- `npm install sqlite --save`
    -sqlite3 
        Usage:- Used to interact with the SQLite database for executing SQL queries and managing the database schema.
        Installation:- `npm install sqlite3 --save`
    -nodemon
        Usage:- Used during development to automatically restart the server when code changes, improving efficiency and ease of development.
        Installation:- `npm install nodemon --save`
## Register a new user 
    Endpoint:- `POST /register/`  
    Description: This endpoint is used to register a new user by providing the necessary user details like username, email, password, and role. 
    Headers:
        `Content-Type`: application/json 

    Request_body:- 
        {
            "username": "anji",
            "email": "anji123@gmail.com",
            "password": "anji@123",
            "role": "admin"
        }
    Response:- 
        201 Created: The user is successfully registered.
        400 Bad request: Email or username already exists.

## Login 
    EndPoint:- POST /login/ 
    Description:- This endpoint is used for logging in with the user's email and password. On successful login, it returns a JWT token which can be used for subsequent requests.
    Headers:-
        Content-Type: application/json
    Request-body:- 
        {
            "email": "anji123@gmail.com",
            "password": "anji@123"
        }
    Response:-
        200 OK: Returns a JSON object containing the JWT token.
        401 Unauthorized: Incorrect email or password.

## Create a New Product
    Endpoint: POST /products/
    Description: This endpoint is used to create a new product. Requires authentication via a JWT token.
    Headers:
    Content-Type: application/json
    Authorization: Bearer <JWT_TOKEN> (Replace <JWT_TOKEN> with the actual token) 
    Request-body:- 
        {
            "title": "paper",
            "description": "this is a paper.",
            "inventoryCount": 20
        }
    Response:- 
        201 Created: The product is successfully created.
        401 Unauthorized: JWT token is missing or invalid.
        400 Bad Request: Validation error, such as missing or invalid fields.


## Get All Products
    Endpoint: GET /products/
    Description: This endpoint is used to retrieve a list of all products. Requires authentication via a JWT token.
    Headers:
    Authorization: Bearer <JWT_TOKEN> (Replace <JWT_TOKEN> with the actual token)
    Response:
        200 OK: Returns a JSON array of products.
        401 Unauthorized: JWT token is missing or invalid. 

## Update a Product
    Endpoint: PUT http://localhost:3000/products/1/

    Description: This endpoint is used to update the details of a specific product by its ID. Requires authentication via a JWT token.
    Headers:
    Content-Type: application/json
    Authorization: Bearer <JWT_TOKEN> (Replace <JWT_TOKEN> with the actual token)
    Request-body:
        {
            "title": "fridge",
            "description": "this is a fridge",
            "inventoryCount": 75
        }
    Response:
    200 OK: The product is successfully updated.
    401 Unauthorized: JWT token is missing or invalid.

## Delete a Product
    Endpoint: DELETE /products/2/
    Description: This endpoint is used to delete a specific product by its ID. Requires authentication via a JWT token.
    Headers:
    Authorization: Bearer <JWT_TOKEN> (Replace <JWT_TOKEN> with the actual token)
    Response:
    204 No Content: The product is successfully deleted.
    401 Unauthorized: JWT token is missing or invalid.
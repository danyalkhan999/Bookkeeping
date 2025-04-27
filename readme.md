````markdown
# Library Management API Documentation

## API Endpoints

### Books

#### 1. GET /api/books

Retrieve a list of all books.

- Method: `GET`
- Headers:
  - `Authorization: Bearer <your_jwt_token>`
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "books": [
        {
          "_id": "<book_id>",
          "title": "<book_title>",
          "description": "<book_description>",
          "coverImage": "<cloudinary_image_url>",
          "author": "<author_name>",
          "borrower": "<borrower_name>",
          "libraries": ["<library_name>", "<library_name>"]
        },
        ...
      ]
    }
    ```

#### 2. GET /api/books/:id

Retrieve details of a specific book by its ID. This should include the details of the Library, Author, and Borrower associated with the book.

- Method: `GET`
- Headers:
  - `Authorization: Bearer <your_jwt_token>`
- Params:
  - `id`: Book ID
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "_id": "<book_id>",
      "title": "<book_title>",
      "description": "<book_description>",
      "coverImage": "<cloudinary_image_url>",
      "author": {
        "_id": "<author_id>",
        "name": "<author_name>",
        "email": "<author_email>"
      },
      "borrower": {
        "_id": "<borrower_id>",
        "name": "<borrower_name>",
        "email": "<borrower_email>"
      },
      "libraries": [
        {
          "_id": "<library_id>",
          "name": "<library_name>",
          "address": "<library_address>"
        },
        ...
      ]
    }
    ```

#### 3. POST /api/books

Create a new book entry.

- Method: `POST`
- Headers:
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: multipart/form-data`
- Body (form-data):
  - `title`: `<book_title>` _(Required)_
  - `description`: `<book_description>` _(Optional)_
  - `libraries`: `<array_of_library_ids>` _(Optional)_
  - `coverImage`: `<file>` 
- Response:
  - Status Code: `201 Created`
  - Body:
    ```json
    {
      "message": "Book Created Successfully",
      "book": {
        "title": "<book_title>",
        "description": "<book_description>",
        "coverImage": "<cloudinary_image_url>",
        "libraries": ["<library_id1>", "<library_id2>"],
        "_id": "<book_id>",
        "author": "<author_id>"
      }
    }
    ```

#### 4. PUT /api/books/:id

Update details of a specific book by its ID.

- Method: `PUT`
- Headers:
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: multipart/form-data`
- Params:
  - `id`: Book ID
- Body (form-data):
  - `title`: `<new_book_title>` _(Optional)_
  - `description`: `<new_book_description>` _(Optional)_
  - `libraries`: `<array_of_library_ids>` _(Optional)_
  - `coverImage`: `<file>` _(Optional, new image file)_
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "message": "Book Updated Successfully",
      "book": {
        "title": "<updated_book_title>",
        "description": "<updated_book_description>",
        "coverImage": "<cloudinary_image_url>",
        "libraries": ["<library_id1>", "<library_id2>"],
        "_id": "<book_id>",
        "author": "<author_id>"
      }
    }
    ```

#### 5. DELETE /api/books/:id

Delete a book by its ID.

- Method: `DELETE`
- Headers:
  - `Authorization: Bearer <your_jwt_token>`
- Params:
  - `id`: Book ID
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "message": "Book Deleted Successfully"
    }
    ```

---

### Users

#### 1. POST /api/users/register

Register a new user (both authors and borrowers).

- Method: `POST`
- Body (JSON):
  - `name`: `<user_name>` _(Required)_
  - `email`: `<user_email>` _(Required)_
  - `password`: `<user_password>` _(Required)_
  - `role`: `<author/borrower>` _(Required)_
- Response:
  - Status Code: `201 Created`
  - Body:
    ```json
    {
      "message": "User Registered Successfully",
      "user": {
        "_id": "<user_id>",
        "name": "<user_name>",
        "email": "<user_email>",
        "role": "<user_role>"
      }
    }
    ```

#### 2. POST /api/users/login

Authenticate user and generate JWT token.

- Method: `POST`
- Body (JSON):
  - `email`: `<user_email>` _(Required)_
  - `password`: `<user_password>` _(Required)_
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "message": "Login Successful",
      "token": "<jwt_token>"
    }
    ```

---

### Borrowing

#### 1. POST /api/borrow

Borrow a book against a charge.

- Method: `POST`
- Headers:
  - `Authorization: Bearer <your_jwt_token>`
- Body (JSON):
  - `bookId`: `<book_id>` _(Required)_
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "message": "Book Borrowed Successfully",
      "borrowedBook": {
        "_id": "<book_id>",
        "title": "<book_title>",
        "borrower": "<borrower_name>",
        "dueDate": "<due_date>"
      }
    }
    ```

#### 2. PUT /api/return/:id

Return a borrowed book by its ID.

- Method: `PUT`
- Headers:
  - `Authorization: Bearer <your_jwt_token>`
- Params:
  - `id`: Book ID
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "message": "Book Returned Successfully",
      "book": {
        "_id": "<book_id>",
        "title": "<book_title>",
        "borrower": null,
        "dueDate": null
      }
    }
    ```

---

### Libraries

#### 1. GET /api/libraries

Retrieve a list of all libraries.

- Method: `GET`
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "libraries": [
        {
          "_id": "<library_id>",
          "name": "<library_name>",
          "address": "<library_address>"
        },
        ...
      ]
    }
    ```

#### 2. GET /api/libraries/:id

Retrieve details of a specific library by its ID. This should include the details of all the books owned by the library, and for each book, the borrower details.

- Method: `GET`
- Params:
  - `id`: Library ID
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "_id": "<library_id>",
      "name": "<library_name>",
      "address": "<library_address>",
      "books": [
        {
          "_id": "<book_id>",
          "title": "<book_title>",
          "borrower": {
            "_id": "<borrower_id>",
            "name": "<borrower_name>"
          }
        },
        ...
      ]
    }
    ```

#### 3. POST /api/libraries

Create a new library.

- Method: `POST`
- Body (JSON):
  - `name`: `<library_name>` _(Required)_
  - `address`: `<library_address>` _(Required)_
- Response:
  - Status Code: `201 Created`
  - Body:
    ```json
    {
      "message": "Library Created Successfully",
      "library": {
        "_id": "<library_id>",
        "name": "<library_name>",
        "address": "<library_address>"
      }
    }
    ```

#### 4. PUT /api/libraries/:id

Update details of a specific library by its ID.

- Method: `PUT`
- Params:
  - `id`: Library ID
- Body (JSON):
  - `

name`: `<updated*library_name>` *(Optional)\_

- `address`: `<updated_library_address>` _(Optional)_
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "message": "Library Updated Successfully",
      "library": {
        "_id": "<library_id>",
        "name": "<updated_library_name>",
        "address": "<updated_library_address>"
      }
    }
    ```

#### 5. DELETE /api/libraries/:id

Delete a library by its ID.

- Method: `DELETE`
- Params:
  - `id`: Library ID
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "message": "Library Deleted Successfully"
    }
    ```

---

### Library Inventory

#### 1. GET /api/libraries/:id/inventory

Retrieve a list of books available in a specific library.

- Method: `GET`
- Params:
  - `id`: Library ID
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "inventory": [
        {
          "_id": "<book_id>",
          "title": "<book_title>",
          "description": "<book_description>",
          "coverImage": "<book_cover_image_url>"
        },
        ...
      ]
    }
    ```

#### 2. POST /api/libraries/:id/inventory

Add a book to the inventory of a specific library.

- Method: `POST`
- Params:
  - `id`: Library ID
- Body (JSON):
  - `bookId`: `<book_id>` _(Required)_
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "message": "Book Added to Library Inventory",
      "inventory": {
        "_id": "<book_id>",
        "title": "<book_title>",
        "description": "<book_description>",
        "coverImage": "<book_cover_image_url>"
      }
    }
    ```

#### 3. DELETE /api/libraries/:id/inventory/:bookId

Remove a book from the inventory of a specific library by its ID.

- Method: `DELETE`
- Params:
  - `id`: Library ID
  - `bookId`: Book ID
- Response:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "message": "Book Removed from Library Inventory"
    }
    ```

---
````

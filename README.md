# book-api-node

REST API for library management built with Node.js, Express and PostgreSQL. Registers books via ISBN using Google Books API with full CRUD support.

## Technologies

- **Node.js** with **Express** for the HTTP server
- **PostgreSQL** for data persistence
- **pg** for direct SQL queries
- **Axios** for HTTP requests to Google Books API
- **dotenv** for environment variable management
- **nodemon** for development auto-reload

## Features

- Register books automatically via ISBN (fetches data from Google Books API)
- Prevent duplicate book registration
- List all books sorted alphabetically
- Search book by ID
- Update loan status (available / borrowed)
- Delete books from the collection

## Project Structure

```
book-api-node/
├── db/
│   └── schema.sql          # Database table definition
├── src/
│   ├── controllers/
│   │   └── bookController.js
│   ├── db/
│   │   └── db.js           # PostgreSQL connection
│   ├── routes/
│   │   └── bookRoutes.js
│   ├── services/
│   │   └── bookService.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL installed and running

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Neto13k/book-api-node.git
cd book-api-node
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Fill in the `.env` file with your credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=book_api
PORT=3000
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

5. Create the database in PostgreSQL and run the schema:

```bash
psql -U your_postgres_user -d book_api -f db/schema.sql
```

Or run the contents of `db/schema.sql` manually in pgAdmin.

6. Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

## API Endpoints

### POST /books
Register a new book using its ISBN. Fetches metadata automatically from Google Books API.

**Request body:**
```json
{
  "isbn": "9780134190440"
}
```

**Response (201):**
```json
{
  "message": "Book created successfully",
  "book": {
    "id": 1,
    "isbn": "9780134190440",
    "title": "The Go Programming Language",
    "author": "Brian W. Kernighan, Alan Donovan",
    "publisher": "Addison-Wesley Professional",
    "published_date": "2015-08-27",
    "cover_url": "http://books.google.com/...",
    "status": "available"
  }
}
```

### GET /books
Returns all books sorted alphabetically by title.

**Response (200):**
```json
{
  "message": "Books loaded successfully",
  "books": [...]
}
```

### GET /books/:id
Returns a single book by its ID.

**Response (200):**
```json
{
  "message": "Book loaded successfully",
  "book": { ... }
}
```

**Response (404):**
```json
{
  "message": "Book not found"
}
```

### PUT /books/:id
Updates the loan status of a book.

**Request body:**
```json
{
  "status": "borrowed"
}
```

Accepted values: `available` or `borrowed`.

**Response (200):**
```json
{
  "message": "Book status updated successfully",
  "book": { ... }
}
```

### DELETE /books/:id
Permanently removes a book from the collection.

**Response (200):**
```json
{
  "message": "Book deleted successfully",
  "book": { ... }
}
```

**Response (404):**
```json
{
  "message": "Book not found"
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host (usually `localhost`) |
| `DB_PORT` | PostgreSQL port (usually `5432`) |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | Database name |
| `PORT` | Port the server will run on |
| `GOOGLE_BOOKS_API_KEY` | API key from Google Cloud Console |

To get a Google Books API key, visit [Google Cloud Console](https://console.cloud.google.com), enable the Books API, and create an API key under Credentials.

## License

MIT
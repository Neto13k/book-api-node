const pool = require("../db/db");
const axios = require("axios");

async function fetchBookByISBN(isbn) {
    try {
        const result = await pool.query("SELECT * FROM books WHERE isbn = $1", [isbn]);
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching book by ISBN from database:", error);
        throw error;
    }
}

async function searchBookByISBN(isbn) {
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.GOOGLE_BOOKS_API_KEY}`);

        const data = response.data;

        if (data.totalItems === 0) {
            throw new Error(`No book found for ISBN: ${isbn}`);
        }

        const bookData = data.items[0].volumeInfo;

        const formattedBook = {
            title: bookData.title,
            authors: bookData.authors,
            publisher: bookData.publisher,
            publishedDate: bookData.publishedDate,
            coverUrl: bookData.imageLinks?.thumbnail,
        };

        console.log("Book found in Google Books API:", formattedBook);
        return formattedBook;

    } catch (error) {
        console.error("Error searching book in Google Books API:", error);
        throw error;
    }
}

async function getAllBooks() {
    try {
        const result = await pool.query("SELECT * FROM books ORDER BY title ASC");
        return result.rows;
    } catch (error) {
        console.error("Error fetching all books from database:", error);
        throw error;
    }
}

async function getBookById(bookId) {
    try {
        const result = await pool.query("SELECT * FROM books WHERE id = $1", [bookId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching book by ID from database:", error);
        throw error;
    }
}

async function updateBookStatus(bookId, status) {
    try {
        const result = await pool.query("UPDATE books SET status = $1 WHERE id = $2 RETURNING *", [status, bookId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating book status:", error);
        throw error;
    }
}

async function deleteBook (bookId) {
    try {
        const result = await pool.query("DELETE FROM books WHERE id = $1 RETURNING *", [bookId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting book:", error);
        throw error;
    }
}

async function createBook(isbn) {
    try {
        // Check if book already exists in database
        const existingBook = await fetchBookByISBN(isbn);
        if (existingBook) {
            throw new Error(`Book with ISBN ${isbn} already exists in database`);
        }

        // Search book data from Google Books API
        const bookData = await searchBookByISBN(isbn);

        // Map authors array to single author string (DB column is `author`) and map published date
        const author = Array.isArray(bookData.authors) ? bookData.authors.join(', ') : bookData.authors || null
        const publishedDate = bookData.publishedDate || null

        // Insert book into database — ajustado para colunas existentes no schema
        const result = await pool.query(
            "INSERT INTO books (isbn, title, author, publisher, published_date, cover_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [isbn, bookData.title, author, bookData.publisher, publishedDate, bookData.coverUrl]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error creating book:", error);
        throw error;
    }
}




module.exports = { fetchBookByISBN, searchBookByISBN, getAllBooks, getBookById, updateBookStatus, deleteBook, createBook };
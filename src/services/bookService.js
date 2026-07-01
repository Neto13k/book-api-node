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
            publicDate: bookData.publishedDate,
            description: bookData.description,
            pageCount: bookData.pageCount,
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


module.exports = { fetchBookByISBN, searchBookByISBN, getAllBooks,};
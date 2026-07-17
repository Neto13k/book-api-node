const bookService = require('../services/bookService');

const createBook = async (req, res) => {
  const { isbn } = req.body;
  try {
    const book = await bookService.createBook(isbn);
    if (!book) {
      return res.status(400).json({ message: 'Book not created' });
    }

    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    res.status(400).json({ message: 'Book not created', error: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    if (!books || books.length === 0) {
      return res.status(200).json({ message: 'No books found', books: [] });
    }

    res.status(200).json({ message: 'Books loaded successfully', books });
  } catch (error) {
    res.status(500).json({ message: 'Books not loaded', error: error.message });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await bookService.getBookById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book loaded successfully', book });
  } catch (error) {
    res.status(404).json({ message: 'Book not found', error: error.message });
  }
};

const updateBookStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const book = await bookService.updateBookStatus(id, status);
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await bookService.deleteBook(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully', book: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBookStatus,
  deleteBook
};
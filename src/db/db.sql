CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  isbn VARCHAR(13) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  publisher VARCHAR(255),
  published_date VARCHAR(20),
  cover_url TEXT,
  status VARCHAR(20) DEFAULT 'available'
);
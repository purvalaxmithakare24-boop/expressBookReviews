
const express = require('express');
const axios = require('axios');

const books = require('./booksdb.js');
const users = require('./auth_users.js').users;
const public_users = express.Router();

// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({
            message: 'User already exists'
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: 'User successfully registered. Now you can login'
    });
});

// Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    return res.status(200).json(book);
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    const result = {};

    for (const isbn in books) {
        if (books[isbn].author.toLowerCase() ===
            req.params.author.toLowerCase()) {
            result[isbn] = books[isbn];
        }
    }

    if (Object.keys(result).length === 0) {
        return res.status(404).json({
            message: 'No books found'
        });
    }

    return res.status(200).json(result);
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const result = {};

    for (const isbn in books) {
        if (books[isbn].title.toLowerCase() ===
            req.params.title.toLowerCase()) {
            result[isbn] = books[isbn];
        }
    }

    if (Object.keys(result).length === 0) {
        return res.status(404).json({
            message: 'No books found'
        });
    }

    return res.status(200).json(result);
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    return res.status(200).json(book.reviews);
});

// Task 10: Get all books using async/await
async function getAllBooks() {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
}

// Task 11: Get book by ISBN using promises
function getBookByISBN(isbn) {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => response.data);
}

// Task 12: Get books by author using async/await
async function getBooksByAuthor(author) {
    const response = await axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
    );
    return response.data;
}

// Task 13: Get books by title using async/await
async function getBooksByTitle(title) {
    const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
    );
    return response.data;
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  
  if (!username || !password) {
      return res.status(300).json({ message: "Username and password are required." });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
      return res.status(300).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(300).json({ message: "User registered successfully." });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const allBooks = JSON.stringify(books, null, 2);
  res.status(200).json({ books: allBooks });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      return res.status(300).json(book);
  } else {
      return res.status(300).json({ message: "Book not found with the given ISBN." });
  }
});


  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  const bookKeys = Object.keys(books);
  for (let key of bookKeys) {
      if (books[key].author === author) {
          matchingBooks.push(books[key]);
      }
  }

  return res.status(300).json({ booksByAuthor: matchingBooks });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  const bookKeys = Object.keys(books);
  for (let key of bookKeys) {
      if (books[key].title === title) {
          matchingBooks.push(books[key]);
      }
  }

  return res.status(300).json({ booksByTitle: matchingBooks });
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      return res.status(300).json(book.reviews);
  } else {
      return res.status(300).json({ message: "Book not found with the given ISBN." });
  }
});
/* 

// ========== Task 10
const axios = require('axios');
const getBooksList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/');
      console.log("Books List:");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching books:", error.message);
    }
  };
  
  getBooksList();


  // ========== Task 11: Get Book by ISBN using Axios (async/await) ==========
  const axios = require('axios');

async function fetchBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Book Details for ISBN ${isbn}:`);
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
fetchBookByISBN("1");


// ========== Task 12: Get Books by Author using Axios (async/await) ==========
const axios = require('axios');

async function fetchBooksByAuthor(author) {
    try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      console.log(`Books by author "${author}":`);
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  fetchBooksByAuthor("Jane Austen");
  
  
// ========== Task 13: Get Books by Title using Axios (async/await) ==========
const axios = require('axios');

async function fetchBooksByTitle(title) {
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      console.log(`Books with title "${title}":`);
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  fetchBooksByTitle("Pride and Prejudice");
  



*/
module.exports.general = public_users;

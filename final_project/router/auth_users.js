const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Username or password not provided" });
    }
  
    const user = users.find(u => u.username === username && u.password === password);
  
    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }
  
    const accessToken = jwt.sign({ username: user.username }, "access", { expiresIn: '1h' });
    req.session.authorization = { accessToken, username: user.username };
  
    return res.status(200).json({ message: "User successfully logged in" });
  });
  

// Add a book review
// Add or Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; 
    const review = req.query.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" }); // إذا لم يكن المستخدم مسجلاً
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    if (books[isbn].reviews[username]) {
        books[isbn].reviews[username] = review; 
        return res.status(200).json({
            message: "Review updated successfully",
            reviews: books[isbn].reviews
        });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added successfully",
        reviews: books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "No review by this user to delete" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

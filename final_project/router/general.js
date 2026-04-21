const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let results = [];
  for (let id in books) {
    if (books[id].author === author) {
      results.push(books[id]);
    }
  }
  res.send(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let results = [];
    for (let id in books) {
      if (books[id].title === title) {
        results.push(books[id]);
      }
    }
    res.send(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

// Task 10: Get all books using async/await
public_users.get('/async-get-all-books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        if (response.data) {
            res.send(response.data);
        } else {
            res.status(404).json({message: "No books found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching books", error: error.message});
    }
});

// Task 11: Get book details based on ISBN using async/await
public_users.get('/async-get-book-isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        if (response.data) {
            res.send(response.data);
        } else {
            res.status(404).json({message: "Book not found by ISBN"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching book by ISBN", error: error.message});
    }
});

// Task 12: Get book details based on author using async/await
public_users.get('/async-get-book-author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        if (response.data && response.data.length > 0) {
            res.send(response.data);
        } else {
            res.status(404).json({message: "Books not found by author"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching book by author", error: error.message});
    }
});

// Task 13: Get book details based on title using async/await
public_users.get('/async-get-book-title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        if (response.data && response.data.length > 0) {
            res.send(response.data);
        } else {
            res.status(404).json({message: "Books not found by title"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching book by title", error: error.message});
    }
});

module.exports.general = public_users;

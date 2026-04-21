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

// Task 10: Retrieve the list of all books available in the shop using async/await with Axios
public_users.get('/async-get-all-books', async function (req, res) {
    try {
        // Perform an asynchronous GET request to the local base URL
        const response = await axios.get('http://localhost:5000/');
        if (response.data) {
            // Successfully retrieved the data, sending it back to the client
            res.send(response.data);
        } else {
            // Handle cases where the response data might be empty
            res.status(404).json({message: "No books found"});
        }
    } catch (error) {
        // Catch any errors during the Axios request (e.g., server not reaching)
        res.status(500).json({message: "Error fetching books", error: error.message});
    }
});

// Task 11: Retrieve specific book details based on ISBN using async/await with Axios
public_users.get('/async-get-book-isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        // Asynchronously fetch book details from the ISBN-specific endpoint
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        if (response.data) {
            // Send the specific book details back to the client
            res.send(response.data);
        } else {
            // Return 404 if no book was found for the provided ISBN
            res.status(404).json({message: "Book not found by ISBN"});
        }
    } catch (error) {
        // Error handling for individual book retrieval
        res.status(500).json({message: "Error fetching book by ISBN", error: error.message});
    }
});

// Task 12: Retrieve all books matching a specific author name using async/await with Axios
public_users.get('/async-get-book-author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        // Fetch books from the author-specific endpoint
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        if (response.data && response.data.length > 0) {
            // Return the list of books associated with the author
            res.send(response.data);
        } else {
            // Handle cases where the author name does not match any records
            res.status(404).json({message: "Books not found by author"});
        }
    } catch (error) {
        // Detailed error reporting for the author search functionality
        res.status(500).json({message: "Error fetching book by author", error: error.message});
    }
});

// Task 13: Retrieve all books matching a specific title using async/await with Axios
public_users.get('/async-get-book-title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        // Asynchronously call the title search endpoint
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        if (response.data && response.data.length > 0) {
            // Send the matching books back to the requester
            res.send(response.data);
        } else {
            // Inform the user if no books were found matching the given title
            res.status(404).json({message: "Books not found by title"});
        }
    } catch (error) {
        // Catch and report errors related to the title searching operation
        res.status(500).json({message: "Error fetching book by title", error: error.message});
    }
});

module.exports.general = public_users;

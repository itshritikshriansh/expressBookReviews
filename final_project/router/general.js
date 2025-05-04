const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };

    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books." });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    
    try {
      const isbn = req.params.isbn;
      const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject("Book not found");
          }
        });
      };
  
      const book = await getBookByISBN(isbn);
      return res.status(200).json(book);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author.toLowerCase();
      const getBooksByAuthor = () => {
        return new Promise((resolve, reject) => {
          const result = Object.values(books).filter(
            (book) => book.author.toLowerCase() === author
          );
          resolve(result);
        });
      };
  
      const matchingBooks = await getBooksByAuthor();
      if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
      } else {
        return res.status(404).json({ message: "No books found for the given author." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author." });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title.toLowerCase();
      const getBooksByTitle = () => {
        return new Promise((resolve, reject) => {
          const result = Object.values(books).filter(
            (book) => book.title.toLowerCase() === title
          );
          resolve(result);
        });
      };
  
      const matchingBooks = await getBooksByTitle();
      if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
      } else {
        return res.status(404).json({ message: "No books found for the given title." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title." });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for the given ISBN." });
  }
});

module.exports.general = public_users;
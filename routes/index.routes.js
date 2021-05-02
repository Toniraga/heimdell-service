const express = require('express');
const { signup, login, protect } = require('../controllers/authController');
const {
	update,
	updateBook,
	getUser,
	getBook,
	getAllBooks,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.use(protect);

router.patch('/update', update);
router.patch('/book/:id', updateBook);
router.get('/user/:id', getUser);
router.get('/book/:id', getBook);
router.get('/books', getAllBooks);

module.exports = router;

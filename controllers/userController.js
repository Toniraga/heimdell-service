const Book = require('../models/book');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const update = catchAsync(async (req, res, next) => {
	if (req.body.password) {
		return next(new AppError('This route is not for password updates.', 400));
	}

	// Update user
	const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		user: updatedUser,
	});
});

const updateBook = catchAsync(async (req, res, next) => {
	// Update book
	const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		book: updatedBook,
	});
});

const getUser = catchAsync(async (req, res, next) => {
	const query = User.findById(req.params.id);
	const user = await query;

	if (!user) {
		return next(new AppError('No User Found With That ID', 404));
	}

	res.status(200).json({
		status: 'success',
		user,
	});
});

const getAllBooks = catchAsync(async (_, res, next) => {
	const books = await Book.find();

	if (books.length < 1) {
		return next(new AppError('There are currently no books', 404));
	}

	res.status(200).json({
		message: 'success',
		length: books.length,
		books,
	});
});

const getBook = catchAsync(async (req, res, next) => {
	const query = Book.findById(req.params.id);
	const book = await query;

	if (!book) {
		return next(new AppError('No Book Found With That ID', 404));
	}

	res.status(200).json({
		status: 'success',
		book,
	});
});

module.exports = {
	update,
	getUser,
	updateBook,
	getAllBooks,
	getBook,
};

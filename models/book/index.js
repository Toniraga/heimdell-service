const mongoose = require('mongoose');

const options = {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
};

const BookSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		author: {
			type: String,
			required: true,
			trim: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		image: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			trim: true,
		},
		stars: {
			type: Number,
			required: true,
			trim: true,
		},
	},
	options
);

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;

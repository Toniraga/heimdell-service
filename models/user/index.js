const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const validator = require('validator');
const generateRandomNumber = require('../../utils/generateRandomNumber');

const { Schema } = mongoose;
const options = {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
};

const userSchema = new Schema(
	{
		full_name: {
			type: String,
			required: [true, 'Please Tell Us Your Name'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Please Provide An Email'],
			trim: true,
			unique: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid email');
				}
			},
		},
		password: {
			type: String,
			required: [true, 'Please Provide A Password'],
			minlength: 8,
			validate(value) {
				if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
					throw new Error(
						'Password must contain at least one letter and one number'
					);
				}
			},
			select: false,
		},
		borrowedbooks: {
			type: [
				{
					type: mongoose.SchemaTypes.ObjectId,
					ref: 'Book',
					default: null,
				},
			],
			validate: [arrayLimit, '{PATH} exceeds the limit of 2'],
		},
		joined: { type: Date, default: Date.now() },
		slug: { type: String, unique: true },
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	options
);

function arrayLimit(val) {
	return val.length <= 2;
}

userSchema.pre('save', function (next) {
	this.slug = slugify(
		`${this.full_name}-${generateRandomNumber()}-${generateRandomNumber()}`,
		{ lower: true }
	);
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre('save', async function (next) {
	// Only run function if password was modified
	if (!this.isModified('password')) return next();
	// Hash the password with the cost of 12
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const User = require('../models/user');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
	return jwt.sign({ id: id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
	res.cookie('jwt', token, cookieOptions);

	// Remove password from output
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

const signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		full_name: req.body.full_name,
		email: req.body.email,
		password: req.body.password,
	});
	createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new AppError('Please Provide Email And Password', 400));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password)))
		return next(new AppError('Incorrect email or password', 401));

	// 3) If everything checks out Send JsonToken back to Client
	createSendToken(user, 200, res);
});

const protect = catchAsync(async (req, res, next) => {
	// check if token exists
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies?.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		return next(
			new AppError('You are not logged in! Please login to access', 401)
		);
	}
	//   validate token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new AppError('The user belonging to this token does no longer exist', 401)
		);
	}

	// Grant Access
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});

module.exports = {
	signup,
	login,
	protect,
};

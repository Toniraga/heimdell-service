const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
const app = require('./app.js');

const PORT = process.env.PORT || 5000;

const DB = process.env.DATABASE_LOCAL;

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection successful!'))
	.catch((err) => console.log(err));

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});

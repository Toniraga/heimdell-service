const express = require('express');
const cors = require('cors');

const routes = require('./routes/index.routes');

const app = express();

app.use(cors()); //enable cors

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/', routes);

app.use('/', (_, res) => {
	res.json({ message: 'Welcome' });
});

app.use('*', (_, res) => {
	res.json({ message: 'Welcome' });
});

module.exports = app;

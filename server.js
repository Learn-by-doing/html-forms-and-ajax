var _ = require('underscore');
var express = require('express');
var exphbs  = require('express-handlebars');
var fs = require('fs');
var app = express();

// Load book data from a JSON file:
var books = JSON.parse(fs.readFileSync('./books.json'));

app.engine('html', exphbs());
app.set('view engine', 'html');

app.get('/', function(req, res, next) {

	res.render('home');
});

app.get('/books/search', function(req, res, next) {

	var matches = findBooks(req.query.q);

	res.render('books', { books: matches });
});

app.get('/api/books/search', function(req, res, next) {

	var matches = findBooks(req.query.q);

	res.json(matches);
});

app.use(function(error, req, res, next) {

	// Catches errors from middleware and controllers/routes.

	if (error) {

		if (!error.status) {
			console.error(error);
			error.message = 'Unexpected error.';
			error.status = 500;
		}

		return res.status(error.status).send(error.message || 'Unexpected error.');
	}

	next();
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

function findBooks(q) {

	if (!q) {
		return books;
	}

	q = q.toLowerCase();

	return _.filter(books, function(book) {
		var title = book.title.toLowerCase();
		var description = book.description.toLowerCase();
		return title.indexOf(q) !== -1 || description.indexOf(q) !== -1;
	});
}

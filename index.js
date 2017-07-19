const express = require('express'),
	app = express(),
	pug = require('pug').create,
	scss = require('node-sass-middleware'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	credentials = require('./lib/credentials'),
	formidable = require('formidable'),
	expressSession = require('express-session'),
	nodemailer = require('nodemailer');
	publicPath = path.join(__dirname, 'public'),
	fortune = require('./lib/fortune'),
	getWeatherData = require('./lib/getWeather'), //not use
	isProd = app.get('env') === 'production';

switch(app.get('env')){
	case 'development':
		app.use(require('morgan')('dev'));
		break;
	case 'production':
		app.use(require('express-logger')({
			path: __dirname+'/log/requests.log'
		}));
		break;
}

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(scss({
	src: publicPath,
	dest: publicPath,
	debug: true,
	outputStyle: 'compressed',
	sourceMap: true
}));

mailTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: credentials.gmail.user,
		pass: credentials.gmail.pass
	}
});

app.use(cookieParser(credentials.secret));
app.use(expressSession({
	resave: false,
	saveUninitialized: false,
	secret: credentials.secret
}));
app.use(express.static(publicPath));


app.use((req, res, next) => {
	res.locals.showTests = !isProd && req.query.test === '1';
	res.locals.alert = req.session.alert;
	delete req.session.alert;
	next();
});

// app.use((req,res,next)=>{
// 	if( !res.locals.partials ) res.locals.partials = {};
// 	res.locals.partials.weather = getWeatherData();
// 	next();
// });

app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', (req, res) => {
	//res.cookie('monster', 'nom nom', { signed: true });
	req.session.userName = 'anonymous';
	let colorSheme = req.session.colorSheme || 'default';
	res.render('index', {
		title: 'Home'
	});
});

const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
'(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

app.post('/sending', (req, res, next) => {
	// let subj = req.body.subj,
	// 	text = req.body.text;
	//  mailTransport.sendMail({
	// 	from: '"Mead NJ" <deUre555@gmail.com>',
	// 	to: 'banderloginorama@gmail.com',
	// 	subject: subj,
	// 	text: text
	// }, err => console.log(err));
	// res.redirect(303, '/done?mail=1');
	let cart = {},
			name = req.body.name || '',
			email = req.body.email || '';

	if(!email.match(VALID_EMAIL_REGEX)) return res.next(new Error('Incorrect email address!'));

	cart.number = Math.random().toString().replace(/^0\.0*/, '');
	cart.billing = {
		name: name,
		email: email
	}

	res.render('email-tpl', {layout: null, cart: cart}, function(err, html){
		if(err) console.log('Template ERROR');
		mailTransport.sendMail({
			from: '"Mead NJ" <deUre555@gmail.com>',
			to: cart.billing.email,
			sabj: "Thx U .",
			html: html,
			generateTextFromHtml: true
		}, err=> consile.log(err.stack));
	});
	res.render('email-tpl', {cart: cart});

});

app.post('/newseller', (req, res) => {
	let name = req.body.name || '',
			email = req.body.email;
	req.session.alert = {
		color: 'red',
		txt: `Hello ${name}!`
	}
	res.redirect(303, '/newseller');
});

app.get('/newseller', (req, res) => {
	res.render('newseller');
});

app.get('/news', (req, res) => {
	res.render('news', {
		title: 'subscribe',
		ref: 'something'
	});
});

app.post('/process', (req, res) => {
	// console.log(`Form from: ${req.query.form}\n
	// 						ref: ${req.body.ref}\n
	// 						Name: ${req.body.name}\n
	// 						Email: ${req.body.email}`);
	if (req.xhr && req.accepts('json,html') === 'json') {
		res.send({
			success: true
		});
	} else {
		res.redirect(303, '/done');
	}
});

app.get('/done', (req, res) => {
	console.log(req.query.file);
	res.render('done', {
		title: 'succes',
		isFile: req.query.file,
		isMail: req.query.mail
	});
});

app.get('/contest/vacation-photo', (req, res) => {
	let date = new Date();
	res.render('vacation-photo', {
		year: date.getFullYear(),
		month: date.getMonth(),
		title: 'Upload yours awesome photos'
	});
});

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if (err) return res.redirect(303, '/error');
		console.log(files);
		res.redirect(303, '/done?file=1');
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About',
		fortune: fortune.getFortune(),
		pageTestScript: 'tests-about'
	});
});

app.get('/error', (req, res) => {
	res.render('error', {
		title: 'Error'
	});
});

app.get('/tours/tours-rate', (req, res) => {
	res.render('tours/tours-rate', {
		title: 'tours rate'
	});
});

app.get('/tours/kwai', (req, res) => {
	res.locals = {
		title: 'Test'
	}
	res.render('tours/kwai', {
		title: 'kwai'
	});
});
app.get('/headers', (req, res) => {
	res.set('Content-Type', 'text/plain');
	var s = '';
	for (var method in req.headers) {
		s += method + ': ' + req.headers[method] + '\n';
	}
	res.send(s);
});
app.get('/test-funcs', (req, res) => {
	res.render('test-funcs', {
		title: 'test-funcs',
		pageTestScript: 'test-funcs',
		scriptForPage: 'test-funcs'
	});
});

app.use((req, res) => {
	res.status(400);
	res.render('404');
});

app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), () => console.log(`Runing on localhost:${app.get('port')}. Env: ${app.get('env')} `));
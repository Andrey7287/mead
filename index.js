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
	nodemailer = require('nodemailer'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	publicPath = path.join(__dirname, 'public'),
	fortune = require('./lib/fortune'),
	getWeatherData = require('./lib/getWeather'), //not use
	isProd = app.get('env') === 'production',
	Vacation = require('./models/vacation.js'),
	VacationInSeasonListener = require('./models/vacationInSeasonListener.js');

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

const opts = {
	useMongoClient: true,
	server: {
		socketOptions: { keepAlive: 1 }
	}
};

let db;
switch (app.get('env')){
	case 'development' :
		db = mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	case 'production' :
		db = monoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	default :
		throw new Error(`Unknown environment ${app.get('env')}`);
}

Vacation.find((err, vacation)=>{
	if(err) return console.error(err);
	if(vacation.length) return;

	const dataVacation = [{
		name: 'Однодневный тур по реке Худ',
		slug: 'hood-river-day-trip',
		category: 'Однодневный тур',
		sku: 'HR199',
		description: 'Проведите день в плавании по реке Колумбия и насладитесь сваренным по традиционным рецептам пивом на реке Худ!',
		priceInCents: 9995,
		tags: ['однодневный тур','река худ','плавание','виндсерфинг','пивоварни'],
		inSeason: true,
		maximumGuests: 16,
		available: true,
		packagesSold: 0
	},{
		name: 'Отдых в Орегон Коуст',
		slug: 'oregon-coast-getaway',
		category: 'Отдых на выходных',
		sku: 'OC39',
		description: 'Насладитесь океанским воздухом и причудливыми прибрежными городками!',
		priceInCents: 269995,
		tags: ['отдых на выходных','орегон коуст','прогулки по пляжу'],
		inSeason: false,
		maximumGuests: 8,
		available: true,
		packagesSold: 0
	},{
		name: 'Скалолазание в Бенде',
		slug: 'rock-climbing-in-bend',
		category: 'Приключение',
		sku: 'B99',
		description: 'Пощекочите себе нервы горным восхождением на пустынной возвышенности.',
		priceInCents: 289995,
		tags: ['отдых на выходных','бенд','пустынная возвышенность','скалолазание'],
		inSeason: true,
		requiresWaiver: true,
		maximumGuests: 4,
		available: false,
		packagesSold: 0,
		notes: 'Гид по данному туру в настоящий момент восстанавливается после лыжной травмы.'
	}];

	dataVacation.forEach( tour => {
		new Vacation(tour).save();
	});
	
});

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

// app.use(function(req,res,next){
// 	let domain = require('domain').create();
// 	domain.on('error', err => {
// 		console.error(`Domain Error: ${err.stack}`);
// 		try {
// 			setTimeout(function() {
// 				console.error('Saifty shutdown');
// 				process.exit(1);
// 			}, 5000);
// 			try {
// 				next(err);
// 			} catch(err) {
// 				console.error(`Express could not rout this error: ${err.stack}`);
// 				res.statusCode = 500;
// 				res.setHeader('content-type', 'text/plain');
// 				res.end('Server ERROR');
// 			}
// 		} catch(err) {
// 			console.error(`Could not send response code - 500 ${err.stack}`)
// 		}
// 	});
// 	domain.add(req);
// 	domain.add(res);
// 	domain.run(next);
// });


app.get('/', (req, res) => {
	//res.cookie('monster', 'nom nom', { signed: true });
	req.session.userName = 'anonymous';
	let colorSheme = req.session.colorSheme || 'default';
	res.render('index', {
		title: 'Home'
	});
});

app.get('/vacation', (req, res)=>{
	Vacation.find({available: true}, (err,vacations)=>{
		if(err) console.error(`DB Error: ${err.stack}`);
		let context = {
			vacations: vacations.map(vacation => {
				return {
					sku: vacation.sku,
					name: vacation.name,
					descr: vacation.description,
					price: vacation.getDisplayPrice(),
					inSeason: vacation.inSeason
				}
			}) 
		};
		res.render('vacation', context); 
	});
});

app.get('/notify', (req,res)=>{
	res.render('notify', {sku: req.query.sku});
});

app.post('/notify', (req,res)=>{
	VacationInSeasonListener.update(
		{ email: req.body.email },
		{ $push: { skus: req.body.sku} },
		{ upsert: true },
		function(err){
			if(err) {
				console.error(err.stack);
				req.sesson.alert = {
					color: 'red',
					txt: 'Internal server Error, try latter'
				};
				return res.redirect(303, '/vacation');
			}
			req.session.alert = {
				color: 'peru',
				txt: 'We will be informed !'
			};
			return res.redirect(303, '/vacation');
		}
	);
});

app.get('/fail', function(req, res){
	throw new Error('Нет!');
});
app.get('/epic-fail', function(req, res){
	process.nextTick(function(){
		throw new Error('Бабах!');
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

let dataDir = __dirname + '/data',
		vacationPhotoDir = dataDir + '/vacation-photo';

fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

function saveContestEntry(contestName, email, year, month, photoPath){
	// TODO
}

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if (err) return res.redirect(303, '/error');

		//console.log(files);
		//res.redirect(303, '/done?file=1');
		
		let photo = files.file,
				dir = `${vacationPhotoDir}/${Date.now()}`,
				path = `${dir}/${photo.name}`;
				// console.log(dir);
				// console.log(path);
				fs.mkdirSync(dir);
				fs.renameSync(photo.path, `${dir}/${photo.name}`)
				saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path);
				return res.redirect(303, '/done?file=1')

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

function startServer(){
	app.listen(app.get('port'), () => console.log(`Runing on localhost:${app.get('port')}. Env: ${app.get('env')} `));
}

require.main === module ? startServer() : module.exports = startServer;


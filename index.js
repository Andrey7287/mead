const express = require('express'),
	app = express(),
	pug = require('pug').create,
	scss = require('node-sass-middleware'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	credentials = require('./lib/credentials'),
	expressSession = require('express-session'),
	nodemailer = require('nodemailer'),
	mongoose = require('mongoose'),
	publicPath = path.join(__dirname, 'public'),
	getWeatherData = require('./lib/getWeather'), //not use
	isProd = app.get('env') === 'production',
	fs = require('fs'),
	autoView = {};

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

app.use('/api', require('cors')());

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


require('./routes.js')(app);

app.use((req,res,next)=>{
	let path = req.path.toLowerCase();
	if ( autoView[path] ) return res.render(autoView[path]);
	if ( fs.existsSync(`${__dirname}/views/${path}.pug`) ) {
		autoView[path] = path.replace(/^\//,'');
		res.render(autoView[path])
	}
	next();
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


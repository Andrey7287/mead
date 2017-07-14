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
			publicPath = path.join(__dirname, 'public'),
			fortune = require('./lib/fortune'),
			getWeatherData = require('./lib/getWeather'), //not use
			isProd = app.get('env') === 'production';

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

app.use(cookieParser(credentials.secret));
app.use(expressSession({
	resave: false,
	saveUninitialized: false,
	secret: credentials.secret
}));
app.use(express.static(publicPath));


app.use((req,res,next)=>{
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

app.get('/', (req, res)=>{
	//res.cookie('monster', 'nom nom', { signed: true });
	req.session.userName = 'anonymous';
	let colorSheme = req.session.colorSheme || 'default';
	res.render('index', {
		title: 'Home'
	});
});


app.get('/news', (req,res)=>{
	res.render('news', {
		title: 'subscribe',
		ref: 'something'
	});
});

app.post('/process', (req,res)=>{
	// console.log(`Form from: ${req.query.form}\n
	// 						ref: ${req.body.ref}\n
	// 						Name: ${req.body.name}\n
	// 						Email: ${req.body.email}`);
	if (req.xhr && req.accepts('json,html') === 'json' ) {
		res.send({ 
			success: true
		});
	} else {
		res.redirect(303, '/done' );
	}
});

app.get('/done', (req,res)=>{
	console.log(req.query.file);
	res.render('done', {
		title: 'succes',
		isFile: req.query.file
	});
});

app.get('/contest/vacation-photo', (req,res)=>{
	let date = new Date();
	res.render('vacation-photo', {
		year: date.getFullYear(),
		month: date.getMonth(),
		title: 'Upload yours awsome photos'
	});
});

app.post('/contest/vacation-photo/:year/:month', (req, res)=>{
	let form = new formidable.IncomingForm();
	form.parse(req, (err,fields,files)=>{
		if(err) return res.redirect(303, '/error');
		console.log(files);
		res.redirect(303, '/done?file=1');
	});
});

app.get('/about', (req, res)=>{
	res.render('about', { 
		title: 'About',
		fortune: fortune.getFortune(),
		pageTestScript: 'tests-about'
	});
});

app.get('/error', (req, res)=>{
	res.render('error', { 
		title: 'Error'
	});
});

app.get('/tours/tours-rate', (req, res)=>{
	res.render('tours/tours-rate', {
		title: 'tours rate'
	});
});

app.get('/tours/kwai', (req, res)=>{
	res.locals = {
		title: 'Test'
	}
	res.render('tours/kwai', {
		title: 'kwai'
	});
});
app.get('/headers', (req, res)=>{
	res.set('Content-Type', 'text/plain');
	var s = '';
	for( var method in req.headers){
		s += method + ': ' + req.headers[method] + '\n';
	}
	res.send(s);
});
app.get('/test-funcs', (req, res)=>{
	res.render('test-funcs', {
		title: 'test-funcs',
		pageTestScript: 'test-funcs',
		scriptForPage: 'test-funcs'
	});
});

app.use((req, res)=>{
	res.status(400);
	res.render('404');
});

app.use((err, req, res, next)=>{
	console.log(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), ()=>console.log(`Express is runing on localhost:${app.get('port')} press ctrl+c for closing up`));


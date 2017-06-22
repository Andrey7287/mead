const express = require('express'),
      app = express(),
      pug = require('pug').create,
			scss = require('node-sass-middleware'), 
      path = require('path'),
			publicPath = path.join(__dirname, 'public');

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

app.use(express.static(publicPath));

app.get('/', (req, res)=>{
	res.render('index');
});

app.get('/about', (req, res)=>{
	res.render('about');
})
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

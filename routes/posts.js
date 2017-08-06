const formidable = require('formidable'),
      fs = require('fs');

exports.notify = (req,res)=>{
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
};

const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

exports.sending = (req, res, next) => {
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

};

exports.newseller = (req, res) => {
  let name = req.body.name || '',
      email = req.body.email;
  req.session.alert = {
    color: 'red',
    txt: `Hello ${name}!`
  }
  res.redirect(303, '/newseller');
}

exports.process = (req, res) => {
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
}

exports.contest = (req, res) => {

  let dataDir = __dirname+'/../data',
      vacationPhotoDir = dataDir + '/vacation-photo',
      form = new formidable.IncomingForm();

  debugger;
  
  fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
  fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

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
        return res.redirect(303, '/done?file=1')

  });
};
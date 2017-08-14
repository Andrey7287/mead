const fortune = require('../lib/fortune');

exports.home = (req, res) => {
  //res.cookie('monster', 'nom nom', { signed: true });
  req.session.userName = 'anonymous';
  let colorSheme = req.session.colorSheme || 'default';
  res.render('index', {
    title: 'Home'
  });
};
exports.about =  (req, res) => {
  res.render('about', {
    title: 'About',
    fortune: fortune.getFortune(),
    pageTestScript: 'tests-about'
  });
};
exports.login =  (req, res) => {
  res.render('login', {
    title: 'Personal'
  });
};


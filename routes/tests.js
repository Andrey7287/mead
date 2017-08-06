exports.test = (req,res,next) => {
  console.log(req.params.name+'\n'+req.params.age);
  next();
}
exports.fail = (req, res) => {
  throw new Error('Нет!');
}
exports.epicFail = (req, res) => {
  process.nextTick(function(){
    throw new Error('Бабах!');
  });
}
exports.funcs = (req, res) => {
  res.render('test-funcs', {
    title: 'test-funcs',
    pageTestScript: 'test-funcs',
    scriptForPage: 'test-funcs'
  });
};
exports.headers = (req, res) => {
  res.set('Content-Type', 'text/plain');
  var s = '';
  for (var method in req.headers) {
    s += method + ': ' + req.headers[method] + '\n';
  }
  res.send(s);
}
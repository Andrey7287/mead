exports.done = (req, res) => {
  console.log(req.query.file);
  res.render('done', {
    title: 'succes',
    isFile: req.query.file,
    isMail: req.query.mail
  });
}
exports.error = (req, res) => {
  res.render('error', {
    title: 'Error'
  });
}
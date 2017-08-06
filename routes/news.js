exports.newseller = (req, res) => {
  res.render('newseller');
}
exports.news = (req, res) => {
  res.render('news', {
    title: 'subscribe',
    ref: 'something'
  });
}
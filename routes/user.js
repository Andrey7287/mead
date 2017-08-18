exports.account = (req,res)=>{
  if(!req.user) return res.redirect(303, '/unauthorized');
  res.render('account', {
    user: req.user.name
  });
};
exports.unauthorized = (req,res)=>{
  res.status(403).render('unauthorized');
};

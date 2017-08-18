// exports.account = (req,res)=>{
//   if(!req.user) return res.redirect(303, '/unauthorized');
//   res.render('account', {
//     user: req.user.name
//   });
// };
// exports.unauthorized = (req,res)=>{
//   res.status(403).render('unauthorized');
// };
exports.account = (req,res)=>{
  res.render('account');
};
exports.accountHistory = (req,res)=>{
  res.render('account/order-history');
};
exports.accountEmail = (req,res)=>{
  res.render('account/email-prefs');
};
exports.sales = (req,res)=>{
  res.render('sales');
};
exports.unauthorized = (req,res)=>{
  res.status(403).render('unauthorized');
};

const User = require('../models/user'),
      passprt = require('passport'),
      FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user,done)=>{done(null, user._id)});

passport.deserializeUser((id,done)=>{
  User.finddById(id, (err, user)=>{
    if (err || !user) return done(err, null);
    done(null, user);
  });
});

module.exports = (app, options)=>{
  if(!options.successRedirect) options.successRedirect = '/account';
  if(!options.failureRedirect) options.successRedirect = '/login';
  return {
    init: function () {
      let env = app.get('env')
    },
    registerRoutes: function () {
      
    }
  }
}
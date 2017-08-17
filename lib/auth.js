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
      let env = app.get('env'),
          config = options.providers;
      passprt.use(new FacebookStrategy({
        clientID: config.facebook[env].appId,
        clientSecret: config.facebook[env].appSecret,
        callbackURL: (options.baseUrl || '') + '/auth/facebook/callback'
      }, (accessToken, refreshToken, profile, done)=>{
        let authId = 'facebook:'+profile.id;
        User.findOne({ authId: authId}, (err, user)=>{
          if(err) return done(err, null);
          if(user) return done(null, user);
          user = new User({
            authId: authId,
            name: profile.displayName,
            created: Date.now(),
            role: 'customer'
          });
          user.save((err)=>{
            if(err) return done(err, null);
            done(null, user);
          });
        });
      }));
      app.use(passprt.initialize()); 
      app.use(passprt.session()); 
    },
    registerRoutes: function () {
      app.get('/auth/facebook', (req,res,next)=>{
        if(req.query.redirect) req.session.authRedirect = req.query.redirect;
        passport.authenticate('facebook'(req,res,next));
      });
      app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: options.failureRedirect
      }), (req, res)=>{
        let redirect = req.session.authRedirect;
        if(redirect) delete req.session.authRedirect;
        res.redirect(303, redirect || options.successRedirect);
      });
    }
  }
}
var _ = require('lodash')
 , passport = require('passport')
 , LocalStrategy = require('passport-local').Strategy
 , conn = require('./db')
 , bcrypt = require('bcrypt')
 , User = conn.model('User')
 , fixtures = require('./fixtures')

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  conn.model('User').findOne({ id: id} , function(err, user) {
    done(err, user);
  });

});

function verify(username, password, done) {
  

  User.findOne({id: username}, function(err, user){
          if(user){
              bcrypt.compare(password, user.password, function(err, result){
                  if(result){
                      done(null, user);
                  }
                  else {
                      done(null, false, {message: 'Incorrect password.'});
                  }
              });
          }
          else{
              done(null, false, { message: 'Incorrect username.' });
          }
      });

}

passport.use(new LocalStrategy(verify));



module.exports = passport;

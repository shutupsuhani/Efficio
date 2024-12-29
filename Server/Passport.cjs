//Passport.js
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.Client_ID,
      clientSecret:process.env.Secret_ID,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, callback) {
       callback(null,profile);
    }
  )
);

passport.serializeUser((user,done)=>{
    done(null,user);
});

passport.deserializeUser((user,done)=>{
    done(null,user);
})


module.exports=passport;

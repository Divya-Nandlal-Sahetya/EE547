const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const jwt = require('jsonwebtoken')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const DATA = [ // should be a database or something persistant
    {email:"team12ee547@gmail.com", provider:"google"} // user data from OAuth has no password
]

const app = express()

// Config
const config = {
    clientId:"119721530498-pjoji587bnnc2lsn6ehoocdi87512kko.apps.googleusercontent.com",
    clientSecret:"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",
    secretOrKey: "mysecret"
}

// Middlewares
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(cookieParser())
app.use(passport.initialize()); 

// Utility functions for checking if a user exists in the DATA array - Note: DATA array is flushed after every restart of server
function FindOrCreate(user){
    if(CheckUser(user)){  // if user exists then return user
        return user
    }else{
        DATA.push(user) // else create a new user
    }
}
function CheckUser(input){
    for (var i in DATA) {
        if(input.email==DATA[i].email && (input.password==DATA[i].password || DATA[i].provider==input.provider))
            return true // found
        else
            null //console.log('no match')
      }
    return false // not found
}

var opts = {}
opts.jwtFromRequest = function(req) { // tell passport to read JWT from cookies
    var token = null;
    if (req && req.cookies){
        token = req.cookies['jwt']
    }
    return token
}
opts.secretOrKey = config.secretOrKey

// main authentication, our app will rely on it
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("JWT BASED AUTH GETTING CALLED") // called everytime a protected URL is being served
    if (CheckUser(jwt_payload.data)) {
        return done(null, jwt_payload.data)
    } else {
        // user account doesnt exists in the DATA
        return done(null, false)
    }
}))

passport.use(new GoogleStrategy({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: "http://localhost:8080/handleGoogleRedirect"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(accessToken, refreshToken, profile)
      console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
      return done(null, profile)
  }
))
  
// These functions are required for getting data To/from JSON returned from Providers
passport.serializeUser(function(user, done) {
    console.log('I should have jack ')
    done(null, user)
})
passport.deserializeUser(function(obj, done) {
    console.log('I wont have jack shit')
    done(null, obj)
})


app.get('/', (req, res)=>{
    res.sendFile('home.html', {root: __dirname})
})
app.get('/login', (req, res)=>{
    res.sendFile('login.html', {root: __dirname})
})

// OAuth Authentication, Just going to this URL will open OAuth screens
app.get('/auth/google',  passport.authenticate('google', { scope: ['profile','email'] }))

// Oauth user data comes to these redirectURLs
app.get('/googleRedirect', passport.authenticate('google'),(req, res)=>{
    console.log('redirected', req.user)
    let user = {
        displayName: req.user.displayName,
        name: req.user.name.givenName,
        email: req.user._json.email,
        provider: req.user.provider }
    console.log(user)

    FindOrCreate(user)
    let token = jwt.sign({
        data: user
        }, 'secret', { expiresIn: 60 }); // expiry in seconds
    res.cookie('jwt', token)
    res.redirect('/')
})

// This url will only open, if the user is signed in
app.get('/profile', passport.authenticate('jwt', { session: false }) ,(req,res)=>{
    res.send(`Wellcome user ${req.user.email}`)
})

const port = process.env.PORT || 8080
app.listen( port, ()=>{
    console.log(`Sever ARG0 listening on port ${port}`)
})
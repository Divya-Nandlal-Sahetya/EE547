const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const jwt = require('jsonwebtoken')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var Gmail = require('node-gmail-api')
var successAccessToken = null
var successRefreshToken = null

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
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "mysecret"
  }))
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(cookieParser())
app.use(passport.initialize()); 
app.use(passport.session());

async function listLabels(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.labels.list({
      userId: 'me',
    });
    const labels = res.data.labels;
    if (!labels || labels.length === 0) {
      console.log('No labels found.');
      return;
    }
    console.log('Labels:');
    labels.forEach((label) => {
      console.log(`- ${label.name}`);
    });
}

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
    successAccessToken = accessToken;
    successRefreshToken = refreshToken;
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

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/', (req, res)=>{
    res.sendFile('home.html', {root: __dirname})
})
app.get('/login', (req, res)=>{
    res.sendFile('login.html', {root: __dirname})
})

app.get("/failed", (req, res) => {
    res.send("Failed")
})
app.get("/success",isLoggedIn, async (req, res) => {
    console.log("************req***********",successAccessToken);
    const gmail = new Gmail(successAccessToken);
    s = gmail.messages('label:inbox', {max: 10})
    var i =0;
    s.on('data', function (d) {
    //console.log(i + " " + d.snippet)
    i = i+1;
    })

    res.send(`Welcome ${req.user.displayName}`);
})

app.get("/successGetEmail",isLoggedIn, async (req, res) => {
    console.log("************req***********",successAccessToken);
    const gmail = new Gmail(successAccessToken);
    s = gmail.messages('label:inbox', {max: 10})
    var i =0;
    var first = "";
    s.on('data', function (d) {
        if(i==0){
            first = d.snippet;
            console.log("first: " + first)
        }
    //console.log(i + " " + d.snippet)
    i = i+1;
    })

    res.send("First" + first);
})

// OAuth Authentication, Just going to this URL will open OAuth screens
app.get('/auth/google',  passport.authenticate('google', { scope: ['profile','https://mail.google.com/',
//'https://www.googleapis.com/auth/gmail.metadata',
'https://www.googleapis.com/auth/gmail.modify',
'https://www.googleapis.com/auth/gmail.readonly',] }))

// Oauth user data comes to these redirectURLs
app.get('/handleGoogleRedirect', passport.authenticate('google', {
    failureRedirect: '/failed',
    successRedirect: '/success'
}))

app.get('/getEmail', passport.authenticate('google', {
    failureRedirect: '/failed',
    successRedirect: '/successGetEmail'
}))
app.get('/getCalendar', passport.authenticate('google', {
    failureRedirect: '/failed',
    successRedirect: '/successGetEmail'
}))

// This url will only open, if the user is signed in
app.get('/profile', passport.authenticate('jwt', { session: false }) ,(req,res)=>{
    res.send(`Wellcome user ${req.user.email}`)
})

const port = process.env.PORT || 8080
app.listen( port, ()=>{
    console.log(`Sever ARG0 listening on port ${port}`)
})
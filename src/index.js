const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const app = express();
const port = process.env.PORT || 3000;

// Configure Express session
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Spotify OAuth strategy
passport.use(new SpotifyStrategy({
    clientID: '221b46468ba146ab82fb85a09a0ba6c9',
    clientSecret: '1843f019312a4ecb8cfd40d3b2c51d33',
    callbackURL: 'http://localhost:3000/auth/spotify/callback'
},
    function (accessToken, refreshToken, expires_in, profile, done) {
        // Save user profile and tokens to session or database
        return done(null, profile);
    }));

// Serialize user for session
passport.serializeUser(function (user, done) {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Spotify authentication route
app.get('/auth/spotify', passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true
}));

// Spotify callback route
app.get('/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/profile');
    }
);

// Profile route
app.get('/profile', (req, res) => {
    res.send(req.user ? `Logged in as ${req.user.displayName}` : 'Not logged in');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

require('dotenv').config();

passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/spotify/callback'
},
    function (accessToken, refreshToken, expires_in, profile, done) {
        // Save user profile and tokens to session or database
        return done(null, profile);
    }));


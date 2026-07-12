const { Router } = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cryptoagentsadp-secret-key-change-in-production';
const USERS = [];

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = USERS.find(u => u.id === id);
  done(null, user);
});

if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  }, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value || `${profile.id}@google.oauth`;
    let user = USERS.find(u => u.email === email);
    if (!user) {
      user = { id: USERS.length + 1, email, name: profile.displayName, provider: 'google', providerId: profile.id, createdAt: new Date().toISOString() };
      USERS.push(user);
    }
    done(null, user);
  }));
}

if (process.env.GITHUB_CLIENT_ID) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
    scope: ['user:email'],
  }, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value || profile.username || `${profile.id}@github.oauth`;
    let user = USERS.find(u => u.email === email);
    if (!user) {
      user = { id: USERS.length + 1, email, name: profile.displayName || profile.username, provider: 'github', providerId: profile.id, createdAt: new Date().toISOString() };
      USERS.push(user);
    }
    done(null, user);
  }));
}

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${process.env.FRONTEND_URL || 'https://www.cryptoagentsadp.xyz'}/oauth/callback?access_token=${token}`);
  }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login?error=oauth_failed' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${process.env.FRONTEND_URL || 'https://www.cryptoagentsadp.xyz'}/oauth/callback?access_token=${token}`);
  }
);

module.exports = router;
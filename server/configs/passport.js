
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export default function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/user/auth/google/callback', // New callback URL
        scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                user = await User.create({
                    googleID: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    isVerified: true
                });
            }
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }));
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
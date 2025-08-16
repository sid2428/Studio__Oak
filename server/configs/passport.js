import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export default function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/user/auth/google/callback`,
    scope: ['profile', 'email']
  },

    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                // When a new user signs up with Google
                user = await User.create({
                    googleID: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    profilePicture: profile.photos[0].value, // Save profile picture
                    isVerified: true
                });
            } else if (!user.profilePicture && profile.photos && profile.photos.length > 0) {
                // Update profile picture for existing users logging in with Google
                user.profilePicture = profile.photos[0].value;
                await user.save();
            }
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }));
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    // **FIXED CODE**
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}

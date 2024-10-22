const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('../models'); // if you have an index file in models directory
const User = db.User;
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    // Local strategy for email and password authentication
    passport.use('local', new LocalStrategy({
        usernameField: 'email',
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // JWT strategy for protecting routes
    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret', // Replace with your own secret
    }, async (jwtPayload, done) => {
        try {
            const user = await User.findByPk(jwtPayload.id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    }));
};

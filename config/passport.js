// config/passport.js
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');

const localOpts = {
    usernameField: 'email',
};

const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret', // Use a strong secret in production
};

// Local Strategy for username and password authentication
passport.use('local', new LocalStrategy(localOpts, async (email, password, done) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return done(null, false, { message: 'Incorrect email or password.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Incorrect email or password.' });

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// JWT Strategy for token authentication
passport.use('jwt', new JwtStrategy(jwtOpts, async (jwt_payload, done) => {
    try {
        const user = await User.findByPk(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

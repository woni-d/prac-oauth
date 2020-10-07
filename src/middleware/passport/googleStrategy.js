const GoogleStrategy = require('passport-google-oauth20').Strategy
const userDB = require('../../models/user')

module.exports = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const { name: { familyName, givenName }, emails, photos } = profile

        const params = { type: 'google', email: emails[0].value, firstName: givenName, lastName: familyName, photo: photos[0].value }
    
        if (await userDB.IsExists({ type: params.type, email: params.email })) await userDB.SignIn(params)
        else await userDB.SignUp(params)
    
        return done(null, profile)
    }
    catch (err) {
        return done(null, { error: err })
    }
})
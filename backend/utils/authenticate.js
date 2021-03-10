const {
    key,
    verify
} = require('./jwt');

/*
Use this as middleware only for authenticated routes.
req.user will contain the user details
*/

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        verify(token, key, (err, user) => {
            if (err) {
                return res.status(403).json({
                    error: 'Invalid API Key.'
                });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({
            error: 'API Key is missing.'
        });
    }
}

module.exports = authenticate;
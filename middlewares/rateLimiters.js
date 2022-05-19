const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
    windowMs: 60 * 1000, //1 minute limit
    max: 5, 
    // message: 'too many attemps. Try again ater.'
    handler: (req, res, next) => {
        let err = new Error('too many attemps. Try again ater.')
        err.status = 429;
        return next(err);
    }
});
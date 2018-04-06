var jwt = require('jsonwebtoken');
var superToken = require('../config');
// var jwtSample = require('jwt-simple');
var moment = require('moment');
var payload = {foo: 'iLOVEcaratred'};
var validate = {};

/*validate token*/
validate.checkValidate = function (token,req, res, next) {
    console.log('Token : '+token)
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, superToken.secret, function (err, decoded) {
            // console.log('strart')
            // console.log(decoded)
            // console.log('end')
            if (err) {
                return res.json({
                    success: false,
                    data: err,
                    status: 401,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.json({
            status: 401,
            success: false,
            message: 'No token provided.'
        });

    }

};
module.exports = validate
var models = require('../models');
var db = models.sequelize.models;
var fs = require('fs');
var express = require('express');
var app=express();
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var localStorage = require('localStorage')
app.set('superSecret', 'ilovescotchyscotch'); // secret variable


var userobj = {};

/*get all content*/


userobj.list=function (req,res,next) {
    db.users.findAll().then(function (contents) {
        res.json({
            success:true,
            data:contents,
            message:"contents"
        });
    }).catch(function (error) {
        res.json({
            success:false,
            data:null,
            message:"error"
        });
    });

}


userobj.create=function(req, res,next) {
    console.log('came')
    console.log(req)
    console.log(req.body)

    // find the user
    db.users.findOne({
        where:{
            userId: req.body.userId
        }
    }).then(function(user) {
        console.log(user)
        // if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload = {
                    userId: user.userId,
                    userName:user.userName
                };
                var token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: 240 // expires in 24 hours
                });
                localStorage.setItem('token', token);
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
};

userobj.facebookauthincate = function (req, res, next) {
    console.log('facebook controller')
    if (req.body.role) {
        db.users.find({
            where: {
                $or: [{
                    username: req.body.username
                }, {
                    mobileNumber: req.body.username
                }],
                roleId: 2
            },
        }).then(function (users) {
            if (!users) {
                res.json({
                    success: false,
                    message: "invalid username or password"
                })
            } else {
                var hash = users.dataValues.password;
                var password = req.body.password;
                var validate = bcrypt.compareSync(password, hash);
                var userObj = {
                    id: users.dataValues.id,
                    mobileNumber: users.dataValues.mobileNumber,
                    name: users.dataValues.name,
                    username: users.dataValues.username,
                    address: users.dataValues.address,
                }
                if (validate === true) {
                    res.json({
                        success: true,
                        data: userObj,
                        message: "login success"
                    })
                } else {
                    res.json({
                        success: false,
                        // data: users,
                        message: "invalid username or password"
                    })
                }
            }
        })
            .catch(function (err) {
                res.json({
                    success: true,
                    data: users
                })
            })
    }
    else {
        db.users.find({
            where: {
                $or: [{
                    username: req.body.username
                }, {
                    mobileNumber: req.body.username
                }],
                roleId: 4
            },
        }).then(function (users) {
            if (!users) {
                res.json({
                    success: false,
                    message: "invalid username or password"
                })
            } else {
                var hash = users.dataValues.password;
                var password = req.body.password;
                var validate = bcrypt.compareSync(password, hash);
                userObj = {
                    id: users.dataValues.id,
                    mobileNumber: users.dataValues.mobileNumber,
                    name: users.dataValues.name,
                    username: users.dataValues.username,
                    address: users.dataValues.address
                }
                if (validate === true) {
                    res.json({
                        success: true,
                        data: userObj,
                        message: "login success"
                    })
                } else {
                    res.json({
                        success: false,
                        // data: users,
                        message: "invalid username or password"
                    })
                }
            }
        })
            .catch(function (err) {
                res.json({
                    success: false,
                    message: "invalid username or password"
                })
            })
    }
}

userobj.googleauthincate = function (req, res, next) {
    console.log('google controller')
    if (req.body.role) {
        db.users.find({
            where: {
                $or: [{
                    username: req.body.username
                }, {
                    mobileNumber: req.body.username
                }],
                roleId: 2
            },
        }).then(function (users) {
            if (!users) {
                res.json({
                    success: false,
                    message: "invalid username or password"
                })
            } else {
                var hash = users.dataValues.password;
                var password = req.body.password;
                var validate = bcrypt.compareSync(password, hash);
                var userObj = {
                    id: users.dataValues.id,
                    mobileNumber: users.dataValues.mobileNumber,
                    name: users.dataValues.name,
                    username: users.dataValues.username,
                    address: users.dataValues.address,
                }
                if (validate === true) {
                    res.json({
                        success: true,
                        data: userObj,
                        message: "login success"
                    })
                } else {
                    res.json({
                        success: false,
                        // data: users,
                        message: "invalid username or password"
                    })
                }
            }
        })
            .catch(function (err) {
                res.json({
                    success: true,
                    data: users
                })
            })
    }
    else {
        db.users.find({
            where: {
                $or: [{
                    username: req.body.username
                }, {
                    mobileNumber: req.body.username
                }],
                roleId: 4
            },
        }).then(function (users) {
            if (!users) {
                res.json({
                    success: false,
                    message: "invalid username or password"
                })
            } else {
                var hash = users.dataValues.password;
                var password = req.body.password;
                var validate = bcrypt.compareSync(password, hash);
                userObj = {
                    id: users.dataValues.id,
                    mobileNumber: users.dataValues.mobileNumber,
                    name: users.dataValues.name,
                    username: users.dataValues.username,
                    address: users.dataValues.address
                }
                if (validate === true) {
                    res.json({
                        success: true,
                        data: userObj,
                        message: "login success"
                    })
                } else {
                    res.json({
                        success: false,
                        // data: users,
                        message: "invalid username or password"
                    })
                }
            }
        })
            .catch(function (err) {
                res.json({
                    success: false,
                    message: "invalid username or password"
                })
            })
    }
}

module.exports = userobj;
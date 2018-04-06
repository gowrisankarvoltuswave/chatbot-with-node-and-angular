var models = require('../models');
var db = models.sequelize;
var express = require('express');
var app = express();
var router = express.Router();
var users = require('../controllers/users');
let mysql = require('mysql');
let config = require('../config/config.js');
let connection = mysql.createConnection(config);
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
app.set('superSecret', 'ilovescotchyscotch'); // secret variable
// var classes = require('../controllers/students');

/* GET users listing. */

router.post('/', function (req, res) {
    connection.query("call getLoginUser(?,?)", [req.body.userId, req.body.password], function (err, rows, fields) {
        console.log(rows[0][0].userId)
        if (!err && rows[0][0].userId) {
            const payload = {
                userId: rows[0][0].userId,
                userName: rows[0][0].userName
            };
            var token = jwt.sign(payload, app.get('superSecret'), {
                expiresIn: Math.floor((new Date(+new Date + 12096e5).getTime()) / 1000) // expires in 24 hours i.e 1440
            });
            let response = rows[0]
            console.log(token)
            // return the information including token as JSON

            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token,
                data: response
            });
        }
        else {
            res.json({
                success: false,
                message: '',
                data: rows[0]
            });
            console.log('Error while performing Query.', err);
        }

    });
});

// router.get('/',function (req,res,next) {
//     connection.query("call GetChatHistoryByUserId()", [req.decoded.userId], function (err, rows, fields) {
//         if (!err) {
//             console.log('the calendar detail: ', rows);
//             res.send(rows);
//         }
//         else{
//             res.send(rows);
//             console.log('Error while performing Query.', err);
//         }
//     });
// });
/*router.put('/:id',function (req,res,next) {
    classes.update(req,res,next)
});

router.param('id',classes.classById)*/
module.exports = router;

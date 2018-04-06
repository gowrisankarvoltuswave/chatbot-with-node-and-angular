var models = require('../models');
var db = models.sequelize;
var express = require('express');
var app=express();
var router = express.Router();
var users = require('../controllers/users');
let mysql = require('mysql');
let config = require('../config/config.js');
let connection = mysql.createConnection(config);
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
app.set('superSecret', 'ilovescotchyscotch'); // secret variable
// var classes = require('../controllers/students');

/* GET users listing. */

router.post('/',function (req,res) {
        let fromDate=req.body.fromDate
        let toDate=req.body.toDate
    connection.query("call LeaveApply(?, ?, ?, ?, ?, ?)", [null,req.decoded.userId,req.body.employeeId,fromDate,toDate,req.body.reason], function (err, rows, fields) {
        if (!err) {
            res.json({
                success: true,
                message: 'Leave Applied Successfully !',
                data:rows[0][0]
            });
        }
        else{
            res.json({
                success: false,
                message: 'Cancelled',
                data:null
            });       
            console.log('Error while performing Query.', err);
        }

    });
});

module.exports = router;

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
    connection.query("call GetSubordinates(?)", [req.body.userId], function (err, rows, fields) {
        if (!err && rows[0].length) {
            res.json({
                success: true,
                message: '',
                data:rows[0]
            });
        }
        else{
            res.json({
                success: false,
                message: 'No subordinates',
                data:null
            });       
            console.log('Error while performing Query.', err);
        }

    });
});
module.exports = router;

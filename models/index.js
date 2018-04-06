var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
// var query = require('log4js');
// var start = query.getLogger('querys');
// var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];






var sequelize = new Sequelize("chatbot", "root", "Apple#123", {
    host: "192.168.1.231",
    password : 'Apple#123',
    dialect: "mysql",
    port: 6603,
    database: 'chatbot'
});
// sequelize.sync({ logging: console.log })

var db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
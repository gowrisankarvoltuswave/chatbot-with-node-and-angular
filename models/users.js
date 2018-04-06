var moment = require('moment-timezone');
module.exports = function (sequelize, DataTypes) {
    var Users = sequelize.define("users", {
        userId: DataTypes.STRING,
        password:DataTypes.STRING,
        userName:DataTypes.STRING,
        googleId:DataTypes.STRING
    });

    return Users;
};
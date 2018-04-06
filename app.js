var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var subordinates = require('./routes/subordinates');
var submitleave = require('./routes/submitleave');
var jwt = require('jsonwebtoken');
var app = express();
var apiai = require('apiai')
let mysql = require('mysql');
let config = require('./config/config.js');
let connection = mysql.createConnection(config);
var AdaptiveCards = require("adaptivecards");
var builder = require('botbuilder');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('superSecret', 'ilovescotchyscotch'); // secret variable
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use(function (req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      console.log(err)
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});
app.use('/subordinates', subordinates);
app.use('/submitleave', submitleave);
app.post('/applyleave', function (req, res) {

  let form = {
    "type": "AdaptiveCard",
    "version": "1.0",
    "speak": "<s>This is test speech</s>",
    "body": [
      {
        "type": "TextBlock",
        "text": "Please Fill all the fields"
      },
      {
        "type": "Input.Date",
        "id": "fromDate",
        "placeholder": "From Date"
      },
      {
        "type": "Input.Date",
        "id": "toDate",
        "placeholder": "To date"
      },
      {
        "type": "Input.Text",
        "id": "reason",
        "placeholder": "Reason for leave"
      }
    ],
    "actions": [
      {
        "id": "leaveformsubmit",
        "type": "Action.Submit",
        "title": "Apply",
        "data": req.body
      }
    ]
  }

  res.json({
    success: true,
    card: true,
    type: 'form',
    message: form,
  })
})
app.get('/custom', (req, res) => {
  let userId = req.decoded.userId
  let agentId = req.query.id
  connection.query("call GetChatHistoryByUserId(?, ?)", [userId, agentId], function (err, rows, fields) {
    if (!err) {
      res.json({
        success: true,
        data: rows[0]
      })
    }
    else {
      res.json({
        success: false,
        data: rows
      })
      console.log('Error while performing Query.', err);
    }
  });
})
app.post('/custom', (req, res) => {
  let agentId = req.body.access
  // console.log(req)
  var SessionId = req.decoded.userId;
  console.log('useId : ' + req.decoded.userId)

  var chatapp = apiai(req.body.access)    //de1666acb1f04913adb5687475a2195a

  var request = chatapp.textRequest(req.body.val, {
    sessionId: SessionId
  })

  // var request =chatapp.VoiceRequest(req.body.val,{
  //   sessionId: '<unique session id>'
  // })

  request.on('response', function (response) {
    let userId = req.decoded.userId
    let userMesage = response.result.resolvedQuery;
    let userRequestAt = req._startTime;
    let botMessage = response.result.fulfillment.speech;
    let botResponseAt = new Date(response.timestamp);
    let adaptiveCardMsg = null
    if (response.result.action == 'user.questions') {
      connection.query("call SaveChatLogs(?, ?, ?, ?, ?, ?, ? ,?, ?)", [null, userId, agentId, userMesage, botMessage, adaptiveCardMsg, userRequestAt, botResponseAt, true], function (err, rows, fields) {
        let key = response.result.parameters.name || response.result.parameters.userId
        if (key == 'name') {
          res.json({
            success: true,
            message: req.decoded.userName
          })
        }
        else if (key == 'userId') {
          res.json({
            success: true,
            message: req.decoded.userId
          })
        }
      })
    }
    else if (response.result.action == ('user.name' || 'user.phone' || 'user.zip')) {
      connection.query("call SaveChatLogs(?, ?, ?, ?, ?, ?, ? ,?, ?)", [null, userId, agentId, userMesage, botMessage, adaptiveCardMsg, userRequestAt, botResponseAt, true], function (err, rows, fields) {

        let parameters = Object.keys(response.result.parameters);

        res.json({
          success: true,
          message: response.result.fulfillment.speech
        })
      })
    }
    else if (response.result.action == 'Leave.status') {
      let employee;
      if (response.result.parameters.employee) {
        employee = response.result.parameters.employee
      } else {
        employee = response.sessionId
      }

      connection.query("call GetEmployeeLeaves(?)", [employee], function (err, rows, fields) {
        if (!err && rows[0][0]) {
          var card = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
              {
                "type": "Container",
                'speak': '<s>Hello!</s><s>Are you looking for a flight or a hotel?</s>',
                "items": [
                  {
                    "type": "TextBlock",
                    "text": 'Leave Balance',
                    "weight": "bolder",
                    "size": "medium",
                    "text-align": "center",
                    "text-decoration": "underline"
                  },
                  {
                    "type": "ColumnSet",
                    "columns": [
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "Image",
                            "url": rows[0][0].employeeImage,
                            "size": "small",
                            "style": "person"
                          }
                        ]
                      },
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "FactSet",
                            "font-size": "10px",
                            "color": "#094ce8",
                            "facts": [
                              {
                                "title": "Employee Id:",
                                "value": rows[0][0].employeeId,
                                "weight": "bolder",
                              },
                              {
                                "title": "Employee Name:",
                                "value": rows[0][0].employeeName,
                                "weight": "bolder",
                              },
                              {
                                "title": "Total Leaves:",
                                "value": rows[0][0].totalLeaves
                              },
                              {
                                "title": "Used Leaves:",
                                "value": rows[0][0].usedLeaves
                              },
                              {
                                "title": "Remaining Leaves:",
                                "value": rows[0][0].totalLeaves - rows[0][0].usedLeaves
                              }
                            ]
                          },

                        ]
                      }
                    ]
                  }
                ]
              }
            ],
            "actions": [
              {
                "type": "Action.ShowCard",
                "title": "View Subordinates",
                "card": {
                  "type": "AdaptiveCard",
                  "body": [
                    {
                      "type": "Input.Text",
                      "id": "key",
                      "isMultiline": false,
                      "placeholder": "Type 'OK' to continue",
                      "display": "block"
                    },
                  ],
                  "actions": [
                    {
                      "type": "Action.Submit",
                      "title": "Submit",
                      "id": 'subordinates',
                      "data": {
                        "userId": rows[0][0].employeeId, "actionName": response.result.action, "userName": rows[0][0].employeeName
                      }
                    }
                  ]
                }
              },
              {
                "type": "Action.OpenUrl",
                "title": "Timeline",
                "id": "timeline",
                "url": "https://voltuswave.com/team/"
              },
              {
                "type": "Action.Submit",
                "title": "Applye Leaves",
                "id": 'applyleave',
                "data": {
                  "userId": rows[0][0].employeeId, "actionName": response.result.action, "userName": rows[0][0].employeeName
                }
              }
            ]
          }
          let actionObj = { userId: rows[0][0].employeeId, "actionName": response.result.action, "userName": rows[0][0].employeeName }
          connection.query("call SaveChatLogs(?, ?, ?, ?, ?, ?, ? ,?, ?)", [null, userId, agentId, userMesage, null, JSON.stringify(card), userRequestAt, botResponseAt, true], function (err, rows, fields) {
            res.json({
              success: true,
              card: true,
              type: 'card',
              message: card,
              action: actionObj
            })
          })
        }
        else {
          res.json({
            success: false,
            message: 'Error Occurred'
          })
        }
      })


    }
    else if (response.result.action == 'purchase.history') {

      connection.query("call GetPurhaseHistory(?)", [userId], function (err, rows, fields) {
        if (!err && rows[0][0]) {
          let FactSetObj1 = {}
          let FactSetObj2 = {}
          let FactSetObj3 = {}
          let FactSetArr = []      //"title": "UserID:", "value": rows[0][0].employeeId, "weight": "bolder",
          for (obj of rows[0]) {
            FactSetObj1.title = 'UserID'
            FactSetObj1.value = obj.userId
            FactSetObj1.weight = "bolder"

            FactSetObj2.title = 'Date'
            FactSetObj2.value = obj.Date
            FactSetObj2.weight = "bolder"

            FactSetObj3.title = 'Purchase Amt'
            FactSetObj3.value = obj.purchaseAmount
            FactSetObj3.weight = "bolder"

            FactSetArr.push(FactSetObj1, FactSetObj2, FactSetObj3)
          }
          var list = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
              {
                "type": "Container",
                'speak': '<s>Hello!</s><s>Are you looking for a flight or a hotel?</s>',
                "items": [
                  {
                    "type": "TextBlock",
                    "text": 'Purchase History',
                    "weight": "bolder",
                    "size": "medium",
                    "text-align": "center",
                    "text-decoration": "underline"
                  },
                  {
                    "type": "ColumnSet",
                    "columns": [
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "FactSet",
                            "font-size": "10px",
                            "color": "#094ce8",
                            "facts": FactSetArr
                          },

                        ]
                      }
                    ]
                  }
                ]
              }
            ],

          }

          connection.query("call SaveChatLogs(?, ?, ?, ?, ?, ?, ? ,?, ?)", [null, userId, agentId, userMesage, null, JSON.stringify(list), userRequestAt, botResponseAt, true], function (err, rows, fields) {
            res.json({
              success: true,
              card: true,
              type: 'card',
              message: list,
            })
          })


        }

      })


    }
    else if (response.result.action == 'input.welcome') {
      connection.query("call SaveChatLogs(?, ?, ?, ?, ?, ?, ? ,?, ?)", [null, userId, agentId, userMesage, botMessage, adaptiveCardMsg, userRequestAt, botResponseAt, true], function (err, rows, fields) {
        res.json({
          success: true,
          message: response.result.fulfillment.speech
        })
      })
    }
    else {
      connection.query("call SaveChatLogs(?, ?, ?, ?, ?, ?, ? ,?, ?)", [null, userId, agentId, userMesage, botMessage, adaptiveCardMsg, userRequestAt, botResponseAt, true], function (err, rows, fields) {
        res.json({
          success: true,
          message: response.result.fulfillment.speech
        })
      })
    }

  })

  request.on('error', function (error) {
    console.log('error')
    res.send(error)
  })

  request.end()
})
// route middleware to verify a token


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

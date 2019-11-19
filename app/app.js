// SPDX-License-Identifier: AGPL-3.0-or-later

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
var port = process.env.PORT || 3000;
var med = require("./med");
var SqlString = require("sqlstring");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// connection configurations
var dbConn = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});
// connect to database

//Define REST API endpoints
app.get("/", (req, res) =>
  res.redirect("https://practical-roentgen-6e9cc1.netlify.com/index.html")
);

//Post an email to our DB
app.post("/emails", function(req, res) {
  // dbConn.connect();
  var params = req.body;

  let authKey = process.env.auth;
  if (params.Authentication !== authKey) {
    res.send({ error: true, error_type: "auth" });
    return;
  }

  console.log("FIN 0: " + JSON.stringify(params));

  params.sender = SqlString.escape(params.sender);
  params.receiver = SqlString.escape(params.receiver);
  params.received = SqlString.escape(params.received);
  params.body = SqlString.escape(params.body);

  console.log(JSON.stringify(params));
  try {
    dbConn.query(
      `
        SELECT COUNT(*) FROM emails
         WHERE sender = ${params.sender}
           AND receiver = ${params.receiver}
           AND received = ${params.received} ;
    `,
      function(error, count, fields) {
        if (error) {
          res.send({ error: true, error_type: "internal" });
          return;
        }

        console.log(`
      SELECT COUNT(*) FROM emails
       WHERE sender = ${params.sender}
         AND receiver = ${params.receiver}
         AND received = ${params.received} ;
  `);
        console.log("Count is: " + JSON.stringify(count));
        count = count[0]["COUNT(*)"];

        if (count === 0) {
          query = `INSERT INTO emails (sender, receiver, body, received) VALUES (${params.sender}, ${params.receiver}, ${params.body}, ${params.received});`;
        } else {
          query = `SELECT * FROM emails;`;
        }
        console.log(query);
        dbConn.query(query, function(error, data, fields) {
          try {
            if (error) {
              res.send({ error: true, error_type: "internal" });
            } else {
              //FRANK's CODE
              med(params.sender, params.receiver, params.received, res);
            }
          } catch (error) {
            res.send({ error: true, error_type: "internal" });
          }
          // dbConn.end();
        });
      }
    );
  } catch (e) {}
});

// set port
app.listen(port, function() {
  console.log("Node app is running on port 3000");
});

module.exports = app;

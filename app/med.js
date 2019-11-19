// Mass Email Detector --- Similarity Calculator
// Author: Frank Seifferth <seifferf@tcd.ie>
//
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// This script uses a modified version of the edit-distance library
// by Christoph Schulz <https://github.com/schulzch/edit-distance-js>.
// The relevant parts are included in this folder.

let mysql = require("mysql");
let levenshtein = require("./levenshtein");
let minimum_edit_distance = function(a, b) {
  return levenshtein(
    a,
    b,
    function(x) {
      return 1;
    }, // insert
    function(x) {
      return 1;
    }, // remove
    function(a, b) {
      return a !== b ? 2 : 0;
    } // update
  ).distance;
};

let threshold = 0.9; // How much overlap is still "the same email"

let tokenize = function(mail) {
  return mail.replace(/([\.,!;:()\[\]])/gm, " $1 ").split(/\s+/);
};

let med = function(sender, receiver, date, res) {
  let db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
  });
  db.connect();

  db.query(
    `
        SELECT body FROM emails
         WHERE sender = ${sender}
           AND receiver = ${receiver}
           AND received = ${date} ;
    `,
    function(error, mail, fields) {
      if (error) {
        res.send({ error: true, error_type: "internal" });
        return;
      }

      db.query(
        `
            SELECT body FROM emails
             WHERE sender = ${sender}
               AND receiver <> ${receiver} ;
        `,
        function(error, others, fields) {
          if (error) {
            res.send({ error: true, error_type: "internal" });
            return;
          }

          mail = mail[0];
          // Minimum Edit Distance gives twice the number of differing words
          // We normalize by the length of the mail being checked in order to
          // get a measure of "how much of this mail's content is original"
          let limit = 2 * Math.round((1 - threshold) * mail.body.length);

          let matches = 0;
          mail = tokenize(mail.body);
          for (x of others) {
            x = tokenize(x.body);
            if (minimum_edit_distance(mail, x) <= limit) matches++;
          }
          db.end();
          let result = {
            error: false,
            checked: others.length,
            matches: matches
          };
          res.send(result);
          console.log("OUTPUT: " + JSON.stringify(result));
        }
      );
    }
  );
};

module.exports = med;

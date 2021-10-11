"use strict";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  resquests = require("./resquests.js"),
  functions = require("./functions.js"),
  app = express().use(body_parser.json()); // creates express http server

let referralCodeGenerator = require("referral-code-generator");

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  //je prends l'intent
  let displayName;
  let numJournal;
  let user;

  //console.log(req.body);
  displayName = req.body.queryResult.intent.displayName;
  let session = req.body.session;
  let sessionTab = session.split("/");
  user = sessionTab[4];
  console.log(user);
  console.log(req.body.originalDetectIntentRequest.payload);
});

app.post("/matchs", (req, res) => {
  resquests.matchs_du_jour(res);
  console.log(req.body);
});

app.post("/match", (req, res) => {
  let id = req.body.num_match;
  functions.matchs_du_jour_details(res, id);
  console.log(req.body);
});

app.post("/match_df", (req, res) => {
  let id = parseInt(req.body.num_match - 1);
  let foot_tab_id = req.body.foot_tab_id.split(",");
  functions.matchs_du_jour_details(res, foot_tab_id[id]);
  //resquests.vers_matchs_du_jour_details(res, id);

  console.log(req.body);
});

app.post("/lova", (req, res) => {
  let pf = req.query.pf;
  let pg = req.query.pg;

  let charge = "ok";

  request(
    {
      uri: "https://love-calculator.p.rapidapi.com/getPercentage",
      qs: {
        fname: pf,
        sname: pg
      },
      method: "GET",
      headers: {
        "x-rapidapi-key": "a9TX7v3RZ5mshDZ5VOCyKOMkrdMUp18VxWfjsng8I7wHl3kL1x",
        "x-rapidapi-host": "love-calculator.p.rapidapi.com",
        useQueryString: true
      }
    },
    (err, resp, body) => {
      if (!err) {
        console.log(body);
        body = JSON.parse(body);

        charge = {
          messages: [
            {
              message: {
                text:
                  "La compatibilité en amour entre " +
                  pf +
                  " et " +
                  pg +
                  " est de: " +
                  body.percentage +
                  "%"
              }
            }
          ]
        };
        console.log(body);
        res.status(200).send(charge);
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
});

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<b>Bienvenue sur Maxofy. Veuillez vous rendre sur  <a title="Titre du lien" href="https://wa.me/33755463502">wa.me/22952750532</a></b>'
    );
});

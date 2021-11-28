const request = require("request"),
  functions = require("./functions.js");
let Parser = require("rss-parser"),
  parser = new Parser(),
  referralCodeGenerator = require("referral-code-generator");

var matchstous;

module.exports.matchs_du_jour = res => {
  var charge;

  request(
    {
      uri: "https://api.football-data.org/v2/matches",
      method: "GET",
      headers: {
        "X-Auth-Token": "184380ba95b646908ca4206dbfd09049"
      }
    },
    (err, resp, body) => {
      if (!err) {
        body = JSON.parse(body);
        var text =
          "📋 Matchs de la journée ⚽\n                  ______\nChoisissez ou envoyez le numéro d'ordre d'un match pour afficher ses détails.\n                  ______";

        var firstHours = "";
        var laHours = "";
        let msgs = [];
        let messages = [];
        var replies = [];
        var foot_tab_id = [];
        matchstous = body.matches;

        console.log(body.count);

        if (body.count == 0) {
          text =
            "Il n'y a aucun match intéressant aujourd'hui 😎 On se retrouve demain. Merci.";
          charge = {
            messages: [
              {
                message: {
                  text: text
                }
              }
            ]
          };
          res.status(200).send(charge);
        } else {
          for (let i = 0; i < body.matches.length; i++) {
            const unixTimeZero = Date.parse(body.matches[i].utcDate);
            var date = new Date(unixTimeZero);
            var hours = date.getHours();
            if (hours == 0) {
              hours = 23;
            } else {
              hours = hours - 1;
            }
            var minutes = "0" + date.getMinutes();
            laHours = hours + ":" + minutes.substr(-2);

            var compId = body.matches[i].competition.id;
            var compName = body.matches[i].competition.name;
            var homeTeam = body.matches[i].homeTeam.name;
            var awayTeam = body.matches[i].awayTeam.name;
            foot_tab_id[i] = body.matches[i].id;

            if (compName == "Serie A") {
              if (compId == "2019") {
                compName = compName + " - Italie";
              } else {
                compName = compName + " - Brasil";
              }
            }

            if (laHours != firstHours) {
              text =
                text +
                "\n\n\n⏱️ " +
                laHours +
                " _______________\n\n             (" +
                compName +
                ")\n       " +
                (i + 1) +
                ">  | " +
                homeTeam +
                " vs " +
                awayTeam;
              firstHours = laHours;
            } else {
              text =
                text +
                "\n\n\n             (" +
                compName +
                ")\n       " +
                (i + 1) +
                ">  | " +
                homeTeam +
                " vs " +
                awayTeam;
            }

            if (i <= 13) {
              msgs[0] = text;
               if (i == 13) {
                text = "";
              }
            }

            if (i > 13 && i <= 28) {
              msgs[1] = text;
              if (i == 28) {
                text = "";
              }
            }

            if (i > 28 && i <= 43) {
              msgs[2] = text;
              if (i == 43) {
                text = "";
              }
            }

            if (i > 43 && i <= 58) {
              msgs[3] = text;
              if (i == 58) {
                text = "";
              }
            }

            if (i > 58 && i <= 73) {
              msgs[4] = text;
              if (i == 73) {
                text = "";
              }
            }

            if (i > 73 && i <= 88) {
              msgs[5] = text;
              if (i == 88) {
                text = "";
              }
            }

            console.log("MSGS:\n" + msgs);

            if (i <= 10) {
              replies[i] = {
                content_type: "text",
                title: i + 1 + "> " + homeTeam + " vs " + awayTeam,
                payload:
                  '{"actions":[{"action":"set_field_value","field_name":"num match","value":' +
                  body.matches[i].id +
                  '}, {"action":"send_flow","flow_id":"1629843334972" }]}'
              };
            }
          }

          for (let i = 0; i < msgs.length; i++) {
            if (i == msgs.length - 1) {
              messages[i] = {
                message: {
                  text: msgs[i],
                  quick_replies: replies
                }
              };
            } else {
              messages[i] = {
                message: {
                  text: msgs[i]
                }
              };
            }
          }

          console.log(messages);

          charge = {
            messages: messages,
            actions: [
              {
                action: "set_field_value",
                field_name: "foot_tab_id",
                value: foot_tab_id + ""
              }
            ]
          };
          console.log(charge);
          res.status(200).send(charge);
        }
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

module.exports.vers_matchs_du_jour_details = (res, ordre, matchstous) => {
  var charge;

  var id = matchstous[ordre].id;
  functions.matchs_du_jour_details(res, id);

  console.log(matchstous[ordre]);
  res.status(200);
};

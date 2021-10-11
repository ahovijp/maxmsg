const request = require("request");
let Parser = require("rss-parser"),
  parser = new Parser();

module.exports.matchs_du_jour_details = (res, id) => {
  var charge;
  console.log("je suis la");

  request(
    {
      uri: "https://api.football-data.org/v2/matches/" + id,
      method: "GET",
      headers: {
        "X-Auth-Token": "184380ba95b646908ca4206dbfd09049"
      }
    },
    (err, resp, body) => {
      if (!err) {
        body = JSON.parse(body);
        var firstHours = "";
        var laHours = "";
        var statusFr = "";

        var utcDate = Date.parse(body.match.utcDate);
        let dates = dateBuilderInt(utcDate);

        const lastUpdated = Date.parse(body.match.lastUpdated);
        let lastDates = dateBuilderInt(lastUpdated);
        
        var formattedLastDate =
          lastDates.jr.substr(-2) +
          "/" +
          lastDates.mois.substr(-2) +
          "/" +
          lastDates.annee +
          " à " +
          lastDates.hours.substr(-2) +
          ":" +
          lastDates.minutes.substr(-2) +
          ":" +
          lastDates.seconds.substr(-2);
        var formattedDate = dates.hours.substr(-2) + ":" + dates.minutes.substr(-2);

        var compId = body.match.competition.id;
        var compName = body.match.competition.name;
        var homeTeam = body.match.homeTeam.name;
        var awayTeam = body.match.awayTeam.name;

        var matchday = body.match.matchday;
        var status = body.match.status;
        var score = body.match.fullTime;

        var stade =
          "• STADE ____________________ 🏟️\n\n      " + body.match.venue;

        var scoresHalf =
          body.match.score.halfTime.homeTeam +
          " - " +
          body.match.score.halfTime.homeTeam;
        var scoresFinal =
          body.match.score.fullTime.homeTeam +
          " - " +
          body.match.score.fullTime.homeTeam;
        var extraTime =
          body.match.score.extraTime.homeTeam +
          " - " +
          body.match.score.extraTime.homeTeam;
        var penalties =
          body.match.score.penalties.homeTeam +
          " - " +
          body.match.score.penalties.homeTeam;

        var nbrMatchsPasse = body.head2head.numberOfMatches;
        var totalButsPasse = body.head2head.totalGoals;

        var statsHomeTeam =
          "   🔹 " +
          homeTeam +
          "\n\n         Victoires :    " +
          body.head2head.homeTeam.wins +
          "\n         Égalités  :     " +
          body.head2head.homeTeam.draws +
          "\n         Défaites :     " +
          body.head2head.homeTeam.losses;

        var statsAwayTeam =
          "   🔸 " +
          awayTeam +
          "\n\n         Victoires :    " +
          body.head2head.awayTeam.wins +
          "\n         Égalités  :     " +
          body.head2head.awayTeam.draws +
          "\n         Défaites :     " +
          body.head2head.awayTeam.losses;

        var lesStats =
          "• LES MATCHS PASSÉS ____ 🏆\n         " +
          nbrMatchsPasse +
          " rencontres\n         " +
          totalButsPasse +
          " buts marqués\n\n" +
          statsHomeTeam +
          "\n\n" +
          statsAwayTeam;

        var rencontre = "⚽ " + homeTeam + " vs " + awayTeam + "";

        var eme = matchday+"ème";
        if (matchday == "1") {
          eme = matchday+"ère";
        }
        if (matchday == null) {
          eme = "...";
        }

        switch (status) {
          case "FINISHED":
            status = "Terminé";
            break;

          case "IN_PLAY":
            status = "En cours";
            break;

          case "SCHEDULED":
            status = "À venir [" + formattedDate + "] ⏳";
            break;

          case "POSTPONED":
            status = "Reporté";
            break;
        }

        var lesScores =
          "• STATUT:       " +
          status +
          "\n\n• JOURNÉE :   " +
          eme +
          "\n\n" +
          stade +
          "\n\n• SCORES __________________  🥅\n\n";

        if (scoresFinal != "null - null") {
          lesScores =
            lesScores + "      Final :          " + scoresFinal + "\n";
        } else {
          lesScores =
            lesScores + "      Final :                  à venir...\n";
        }

        if (scoresHalf != "null - null") {
          lesScores = lesScores + "      Mi-temps :  " + scoresHalf + "\n";
        } else {
          lesScores = lesScores + "      Mi-temps :          à venir...\n";
        }

        if (extraTime != "null - null") {
          lesScores = lesScores + "      Prolong. :    " + extraTime + "\n";
        }

        if (penalties != "null - null") {
          lesScores =
            lesScores + "      Pénalit. :      " + penalties + "\n";
        }

        if (compName == "Serie A") {
          if (compId == "2019") {
            compName = compName + " - Italie";
          } else {
            compName = compName + " - Brasil";
          }
        }

        var text =
          rencontre +
          "\n      (" +
          compName +
          ")\n       _____\n       Infos mise à jour le\n       " +
          formattedLastDate +
          "\n\n" +
          lesScores +
          "\n\n" +
          lesStats +
          "\n\n\n           ____ ⚽ ____";

        charge = {
          messages: [
            {
              message: {
                text: text
              }
            }
          ]
        };
        console.log(text);
        res.status(200).send(charge);
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

module.exports.dateBuilder = dateTemp => {
  var date = new Date(dateTemp);
  var annee = date.getFullYear();
  var mois = date.getMonth() + 1;
  var jr = date.getDate();
  var day = date.getDay();
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();

  return {
    date: date,
    annee: annee,
    mois: mois,
    jr: jr,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    day: day
  };
};

function dateBuilderInt(dateTemp) {
  var date = new Date(dateTemp);
  var annee = date.getFullYear();
  var mois = "0" + (date.getMonth() + 1);
  var jr = "0" + date.getDate();
  var day = date.getDay();
  
  var hours = "0" + date.getHours();
  
  if(date.getHours()==0){
    hours = "0" + "23";
  } else {
    hours = "0" + (date.getHours()-1);
  }
  
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();

  return {
    date: date,
    annee: annee,
    mois: mois,
    jr: jr,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    day: day
  };
}

var season = "2014-15";

$(document).ready(function() {
  $.ajax({
        url: 'http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season=2015-16',
        type: "GET",
        dataType: 'jsonp',
        success: function(response) {
            // get players
            players = response['resultSets'][0]['rowSet'];
            
            // retrieve current players
            for (i = 0; i < players.length; i++) {
                if (players[i][2] == 0) continue;

                optionO = document.createElement("option");
                optionO.value = players[i][0];
                optionO.text  = players[i][1];

                optionD = document.createElement("option");
                optionD.value = players[i][0];
                optionD.text  = players[i][1];

                document.getElementById("offense").add(optionO);
                document.getElementById("defense").add(optionD);
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
});

$(function() {
    $('#btn').click(function() {
        player_id_O = document.getElementById("offense").value;
        player_id_D = document.getElementById("defense").value;

        player_name_O = document.getElementById("offense").text;
        player_name_D = document.getElementById("defense").text;

        $.ajax({
            url: 'http://stats.nba.com/stats/playerdashptshotlog?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&Period=0&PlayerID=' + player_id_O + '&Season=' + season + '&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=',
            type: "GET",
            dataType: 'jsonp',
            success: function(response) {
                shot_log = response['resultSets'][0]['rowSet'];
                fgm = 0.0;
                fga = 0.0

                // table object
                table = document.getElementById("stats");

                // clear table
                while (table.hasChildNodes())
                    table.removeChild(table.firstChild);

                // find posessions involving offensive player and defensive player
                for (i = 0; i < shot_log.length; i++) {
                    if (shot_log[i][15] == player_id_D) {
                        fgm += shot_log[i][17];
                        fga++;
                        row = table.insertRow();
                        row.insertCell(0).innerHTML = shot_log[i][1];
                        row.insertCell(1).innerHTML = shot_log[i][8].toFixed(1);
                        row.insertCell(2).innerHTML = shot_log[i][11].toFixed(2);
                        row.insertCell(3).innerHTML = shot_log[i][9];
                        cell = row.insertCell(4)
                        cell.innerHTML = shot_log[i][13];

                        if (shot_log[i][13] == "made")
                            cell.style.color = "green";
                        else
                            cell.style.color = "red";
                    }
                }

                if (fga == 0) 
                    document.getElementById("result").innerHTML = "No matchups found";
                else {
                    // set table header
                    row  = table.insertRow(0);
                    cell = row.insertCell(0); cell.innerHTML = "<b>Match up</b>";
                    cell = row.insertCell(1); cell.innerHTML = "<b>Shot Clock</b>"
                    cell = row.insertCell(2); cell.innerHTML = "<b>Shot Distance</b>"
                    cell = row.insertCell(3); cell.innerHTML = "<b>Dribbles</b>"
                    cell = row.insertCell(4); cell.innerHTML = "<b>Shot Result</b>"
                    
                    document.getElementById("result").innerHTML = "Efficiency: " + (fgm / fga * 100).toFixed(2) + '%';
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

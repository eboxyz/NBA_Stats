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
                option = document.createElement("option");
                option.value = players[i][0];
                option.text  = players[i][1];
                //console.log(option);
                document.getElementById("player_list").add(option);
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
});

$(function() {
    $('#btn').click(function() {
        player_id = document.getElementById("player_list").value;
        $.ajax({
            url: 'http://stats.nba.com/stats/playerdashptshotlog?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&Period=0&PlayerID=' + player_id + '&Season=' + season + '&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=',
            type: "GET",
            dataType: 'jsonp',
            success: function(response) {
                shot_log = response['resultSets'][0]['rowSet'];
                total_shots = shot_log.length;
                shots_made = 0.0;
                period   = [0.0, 0.0, 0.0, 0.0, 0.0];
                dribbles = [0.0, 0.0, 0.0, 0.0, 0.0];

                // compute totals
                for (i = 0; i < total_shots; i++) {
                    index = shot_log[i][6] <= 4 ? shot_log[i][6]-1 : 4;
                    period[index]++;
                    dribbles[index] += shot_log[i][9];
                    shots_made += shot_log[i][17];
                }

                // table object
                table = document.getElementById("stats");

                // clear table
                while (table.hasChildNodes())
                    table.removeChild(table.firstChild);
                
                // add header
                row  = table.insertRow(0);
                cell = row.insertCell(0); cell.innerHTML = "<b>Period</b>";
                cell = row.insertCell(1); cell.innerHTML = "<b>Percentage</b>"
                cell = row.insertCell(2); cell.innerHTML = "<b>Total</b>"
                cell = row.insertCell(3); cell.innerHTML = "<b>Dribbles</b>"
                
                // compute statistics per period and add to table
                for (i = 0; i < 5; i++) {
                    percent = total_shots == 0 ? 0 : period[i] / total_shots * 100;
                    drib = period[i] == 0 ? 0 : dribbles[i] / period[i];
                    row = table.insertRow();
                    
                    row.insertCell(0).innerHTML = i < 4 ? i+1 : "OT";                            
                    row.insertCell(1).innerHTML = percent.toFixed(2) + " %";
                    row.insertCell(2).innerHTML = period[i];
                    row.insertCell(3).innerHTML = drib.toFixed(2);
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

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
                total_dist = 0.0;

                // table object
                table = document.getElementById("stats");

                // clear table
                while (table.hasChildNodes())
                    table.removeChild(table.firstChild);

                if (shot_log.length == 0)
                    document.getElementById("result").innerHTML = "No shots taken";
                else {
                    
                    for (i = 0; i < shot_log.length; i++) {
                        total_dist += shot_log[i][16];
                        row = table.insertRow();
                        row.insertCell(0).innerHTML = shot_log[i][16];
                        row.insertCell(1).innerHTML = shot_log[i][7];
                        row.insertCell(2).innerHTML = shot_log[i][8];
                        row.insertCell(3).innerHTML = shot_log[i][11].toFixed(2);
                        row.insertCell(4).innerHTML = shot_log[i][13];
                        row.insertCell(5).innerHTML = shot_log[i][14];
                    }

                    // set table header
                    row  = table.insertRow(0);
                    cell = row.insertCell(0); cell.innerHTML = "<b>Defender Distance</b>";
                    cell = row.insertCell(1); cell.innerHTML = "<b>Game Clock</b>";
                    cell = row.insertCell(2); cell.innerHTML = "<b>Shot Clock</b>"
                    cell = row.insertCell(3); cell.innerHTML = "<b>Shot Distance</b>"
                    cell = row.insertCell(4); cell.innerHTML = "<b>Shot Result</b>"
                    cell = row.insertCell(5); cell.innerHTML = "<b>Closest Defender</b>"
                    
                    document.getElementById("result").innerHTML = "Average Defender Distance: " + (total_dist / shot_log.length).toFixed(2) + ' ft';
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

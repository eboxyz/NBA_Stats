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
            url: 'http://stats.nba.com/stats/playerdashptpass?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&Period=0&PlayerID=' + player_id + '&Season=' + season + '&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&PerMode=Totals&VsDivision=',
            type: "GET",
            dataType: 'jsonp',
            success: function(response) {
                pass_to   = response['resultSets'][0]['rowSet']
                pass_from = response['resultSets'][1]['rowSet']
                
                // table objects
                table1 = document.getElementById("table1");
                table2 = document.getElementById("table2");

                // clear tables
                while (table1.hasChildNodes())
                    table1.removeChild(table1.firstChild);
                while (table2.hasChildNodes())
                    table2.removeChild(table2.firstChild);

                len_table = pass_to.length != pass_from.length ? Math.min(pass_to.length, pass_from.length) : pass_to.length;
                
                if (len_table == 0) {
                    document.getElementById("data").style.display = "none";
                    document.getElementById("no_data").style.display = "block";
                }
                else {
                    document.getElementById("data").style.display = "block";
                    document.getElementById("no_data").style.display = "none";

                    for (i = 0; i < len_table; i++) {
                        row = table1.insertRow();
                        row.insertCell(0).innerHTML = pass_to[i][6];
                        row.insertCell(1).innerHTML = (pass_to[i][8] * 100).toFixed(2) + "%";
                    }

                    for (i = 0; i < len_table; i++) {
                        row = table2.insertRow();
                        row.insertCell(0).innerHTML = pass_from[i][6];
                        row.insertCell(1).innerHTML = (pass_from[i][8] * 100).toFixed(2) + "%";
                    }

                    // set table header
                    row  = table1.insertRow(0);
                    cell = row.insertCell(0); cell.innerHTML = "<b>Player</b>";
                    cell = row.insertCell(1); cell.innerHTML = "<b>Frequency</b>";
                    // set table header
                    row  = table2.insertRow(0);
                    cell = row.insertCell(0); cell.innerHTML = "<b>Player</b>";
                    cell = row.insertCell(1); cell.innerHTML = "<b>Frequency</b>";
                }
                                
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

var players;            // array of all active players
var player_id;          // player id of current player
var player_name;        // name of current player
var player_last_name;   // last name of current player
var multiplier;         // team multiplier
var score = 0;          // current game score

const PERSON_ID = 0;
const NAME = 1;
const TEAM = 9;
const TIME = 90;


$(document).ready(function() {
  $.ajax({
        url: 'http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=1&LeagueID=00&Season=2015-16',
        type: "GET",
        dataType: 'jsonp',
        success: function(response) {
            // get players
            players = response['resultSets'][0]['rowSet'];
            start_button.disabled = false;
        },
        error: function(error) {
            console.log(error);
        }
    });

    // listen for enter key in input field
    user_answer.addEventListener("keypress", function() {
        if (event.keyCode == 13) 
            ans.click();
    });

    // listen for esc key in input field
    user_answer.addEventListener("keyup", function() {
        if (event.keyCode == 27) 
            skip.click();
    });
});

// enter answer button
$(function() {
    $('#ans').click(function() {
       answer = user_answer.value.toLowerCase();
        // full name correct
        if (answer == player_name) {
            score += multiplier ? 3 : 2;
            points.innerHTML = "Score: " + score;
            getPlayer();
        }
        // last name correct
        else if (answer == player_last_name) {
            score += multiplier ? 2 : 1;
            points.innerHTML = "Score: " + score;
            getPlayer();
        }
        user_answer.value = "";   
    });

    $('#skip').click(function() {
        score -= multiplier ? 2 : 1;
        points.innerHTML = "Score: " + score;
        getPlayer();
        user_answer.value = "";
    });

    // when start button is clicked
    $('#start_button').click(function() {
        // hide / show fields
        clock.style.display = "block";
        title.style.display = "none";
        start_screen.style.display = "none";
        game.style.display = "block";
        user_answer.value = ""; 

        // reset clock / score
        clock.innerHTML = TIME;
        score = 0;
        points.innerHTML = "Score: " + score;

        // set timer
        var scroll = setInterval(function() {
            time = parseInt(clock.innerHTML);
            
            // game over
            if (time == 1) {
                // hide / show fields
                clock.innerHTML = "Final Score: " + score;
                start_screen.style.display = "block";
                game.style.display = "none";
                clearInterval(scroll);
            }
            else
                clock.innerHTML = time - 1;
        }, 1000);

        user_answer.focus();
        getPlayer();
    });
});

// get a random player and show picture
function getPlayer() {
    // get a random player
    do {
        r = Math.floor(Math.random() * players.length);
        id = players[r][PERSON_ID];
    }
    while (players[r] == undefined ||  id == player_id);

    // assign random player to last player
    player_id = id;

    // assign team / picture
    player_img.src = "http://stats.nba.com/media/players/230x185/" + player_id + ".png";

    // retrieve last name and full name
    player_last_name = players[r][NAME].substring(0, players[r][NAME].indexOf(",")).toLowerCase();
    player_name = players[r][NAME].substring(players[r][NAME].indexOf(",") + 2).toLowerCase() + " " + player_last_name;
    
    multiplier = team_select.value == players[r][TEAM];

    // console.log(player_name);
}

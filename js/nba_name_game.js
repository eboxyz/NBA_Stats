var players;            // array of all active players
var player_id = 201156; // player id of current player
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
       answer = answer.replace("'", "").replace(".", "").replace(",","");
        // full name correct
        if (answer == player_name) {
            score += multiplier ? 3 : 2;
            points.innerHTML = "Score: " + score;
            last_player.innerHTML = "<b>Last Player:</b> " + player_last_name; 
            getPlayer();
        }
        // last name correct
        else if (answer == player_last_name.toLowerCase()) {
            score += multiplier ? 2 : 1;
            points.innerHTML = "Score: " + score;
            last_player.innerHTML = "<b>Last Player:</b> " + player_last_name; 
            getPlayer();
        }
        user_answer.focus();
        user_answer.value = "";   
    });

    $('#skip').click(function() {
        score -= multiplier ? 2 : 1;
        points.innerHTML = "Score: " + score;
        last_player.innerHTML = "<b>Last Player:</b> " + player_last_name;
        getPlayer();
        user_answer.focus();
        user_answer.value = "";
    });

    // when start button is clicked
    $('#start_button').click(function() {
        // set scrolling
        var scroll = setInterval(function() {
            window.scrollBy(0, 3);
            if (window.pageYOffset >= 120)
                clearInterval(scroll);
        }, 10);

        // hide / show fields
        clock.style.display = "block";
        title.style.display = "none";
        start_screen.style.display = "none";
        game.style.display = "block";
        user_answer.value = ""; 
        player_last_name = "";

        // reset clock / score
        clock.innerHTML = TIME;
        score = 0;
        points.innerHTML = "Score: " + score;

        // set timer
        var timer = setInterval(function() {
            time = parseInt(clock.innerHTML);
            
            // game over
            if (time == 1) {
                // hide / show fields
                clock.innerHTML = "Final Score: " + score;
                last_player.innerHTML = "<b>Last Player:</b> "; 
                start_screen.style.display = "block";
                game.style.display = "none";
                clearInterval(timer);
            }
            else
                clock.innerHTML = time - 1;
        }, 1000);

        user_answer.focus();
        getPlayer();
    });
    
    // share results to facebook
    $('#fbshare').click(function() {
        window.open('https://www.facebook.com/dialog/feed?app_id=997536013635887&display=popup&picture=http://stats.nba.com/media/players/230x185/' + player_id + '.png&caption=http://domkl14.github.io/NBA_Stats/nba_name_game.html&description=I scored ' + score + ' points in the NBA Name Game! How well do you know the faces of the NBA? Test your NBA knowledge in this 90 second challenge!&link=http://domkl14.github.io/NBA_Stats/nba_name_game.html&redirect_uri=http://domkl14.github.io/NBA_Stats/closewindow.html','MyWindow','width=600,height=300'); 
        return false;
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
    player_last_name = players[r][NAME].substring(0, players[r][NAME].indexOf(","));
    player_name = players[r][NAME].substring(players[r][NAME].indexOf(",") + 2).toLowerCase() + " " + player_last_name.toLowerCase();
    
    // remove punctuation
    player_last_name = player_last_name.replace("'", "").replace(".", "").replace(",", "");
    player_name = player_name.replace("'", "").replace(".", "").replace(",","");

    // nene case
    if (player_id == 2403)
        player_name = "nene";

    multiplier = team_select.value == players[r][TEAM];
}
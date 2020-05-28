var mainDiv;
var gameBoard;

window.onload = function() {
    console.log("Ready!");
    mainDiv = document.getElementById("main");
    this.navigateMenu();
}

function navigateMenu(){
    console.log("Loading the menu...");
    var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      mainDiv.innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "states/menu.html", false);
  xhttp.send();
  document.getElementById("playButton").addEventListener("click", function() {
    navigateGame();
  });
  document.getElementById("optionsButton").addEventListener("click", function() {
    navigateOptions();
  });
}

function navigateOptions(){
    console.log("Loading the options menu...");
    var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      mainDiv.innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "states/settings.html", false);
  xhttp.send();
  document.getElementById("backButton").addEventListener("click", function() {
    navigateMenu();
  });
}

function navigateGame(){
    console.log("Loading the game...");
    var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      mainDiv.innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "states/game.html", false);
  xhttp.send();
  gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML="piss";
}
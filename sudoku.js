var mainDiv;
var gameBoard;
var gamePieces;

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
  generate();
}

function generate(){
  gamePieces = new Array();
  for(var i=0;i<9;i++){
    var row = new Array();
    var tr = document.createElement("tr");
    for(var j=0;j<9;j++){
      var item=document.createElement("td");
      item.innerHTML = "<input type=\"number\" id=\""+i+""+j+"\" min=\"1\" max=\"9\">";
      tr.appendChild(item);
      row.push(item);
    }
    gamePieces.push(row);
    gameBoard.appendChild(tr);
  }
}
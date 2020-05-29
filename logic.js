var mainDiv;
var gameBoard;
var gamePieces;
var internalBoard;
var answer;

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
  document.getElementById("checkButton").addEventListener("click", function(){
    checkAnswer();
  });
  document.getElementById("newGameButton").addEventListener("click", function(){
    document.getElementById("wonModal").style.display ="none";
    newGame();
  })
  document.getElementById("menuButton").addEventListener("click", function(){
    navigateMenu();
  });
  generate();
}

function generate(){
  gamePieces = new Array();
  for(var i=0;i<9;i++){
    var visSeg = document.createElement("div");
    visSeg.classList.add("sudoku-square");
    for(var j=0;j<9;j++){
      var item=document.createElement("div");
      item.classList.add("sudoku-cell")
      item.innerHTML = "<input type=\"number\" id=\""+i+""+j+"\" min=\"1\" max=\"9\">";
      visSeg.appendChild(item);
    }
    gameBoard.appendChild(visSeg);
  }

  gamePieces.push([0,0,0,0,0,0,0,0,0]);
  gamePieces.push([0,0,0,0,0,0,0,0,0]);
  gamePieces.push([0,0,0,0,0,0,0,0,0]);
  gamePieces.push([0,0,0,0,0,0,0,0,0]);
  gamePieces.push([0,0,0,0,0,0,0,0,0]);
  gamePieces.push([0,0,0,0,0,0,0,0,0]);
  gamePieces.push([0,0,0,0,0,0,0,0,0]);
  gamePieces.push([0,0,0,0,0,0,0,0,0]);
  gamePieces.push([0,0,0,0,0,0,0,0,0]);

  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      if(i<3){
        if(j<3){
          gamePieces[0][(3*i)+j]=document.getElementById(i+""+j);
        } else if (j<6){
          gamePieces[1][(3*i)+(j-3)]=document.getElementById(i+""+j);
        } else {
          gamePieces[2][(3*i)+(j-6)]=document.getElementById(i+""+j);
        }
      } else if (i<6){
        if(j<3){
          gamePieces[3][(3*(i-3))+j]=document.getElementById(i+""+j);
        } else if (j<6){
          gamePieces[4][(3*(i-3))+(j-3)]=document.getElementById(i+""+j);
        } else {
          gamePieces[5][(3*(i-3))+(j-6)]=document.getElementById(i+""+j);
        }
      } else {
        if(j<3){
          gamePieces[6][(3*(i-6))+j]=document.getElementById(i+""+j);
        } else if (j<6){
          gamePieces[7][(3*(i-6))+(j-3)]=document.getElementById(i+""+j);
        } else {
          gamePieces[8][(3*(i-6))+(j-6)]=document.getElementById(i+""+j);
        }
      }
    }
  }

  newGame();
}


function newGame(){
  var board = sudoku.generate("very-hard");
  answer = sudoku.solve(board);
  internalBoard = sudoku.board_string_to_grid(board);
  console.log(board);
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      if(internalBoard[i][j] != "."){
      gamePieces[i][j].value=internalBoard[i][j];
      gamePieces[i][j].disabled = true;
      } else {
        gamePieces[i][j].value="";
        gamePieces[i][j].disabled = false;
      }
    }
  }
}

function checkAnswer(){
  var myAnswer="";
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      myAnswer=myAnswer + gamePieces[i][j].value;
    }
  }
  if(myAnswer==answer){
    winGame();
  } else {
    wrongAnswer();
  }
}


function winGame(){
  document.getElementById("wonModal").style.display ="block";
}

function wrongAnswer(){
  document.getElementById("checkButton").classList.add("wrong");
}
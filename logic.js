'use strict';
const remote= require('electron').remote;
const Store = require('electron-store');
const schema = {
  difficulty: {
    type: 'number',
    maximum: 5,
    minimum: 0,
    default: 2
  },
  scale: {
    type: 'number',
    maximum: 4,
    minimum: 1,
    default: 1
  },
  save: {
    type: 'number',
    maximum: 1,
    minimum: 0,
    default: 0
  },
  savedata: {
    type: 'string',
    default: ""
  },
  saveboard: {
    type: 'string',
    default: ""
  }

}
const store = new Store({schema});
var mainDiv;
var gameBoard;
var gamePieces;
var internalBoard;
var answer;
var difficulties = ["Easy", "Medium", "Hard", "Very-Hard", "Insane", "Inhuman"];
var difficulty;
var auto;
var scale;
var save;
var origboard;

window.onload = function() {
    console.log("Ready!");
    mainDiv = document.getElementById("main");
    difficulty = store.get('difficulty');
    auto=store.get('save');
    scale=store.get('scale');
    save=store.get('savedata');
    origboard=store.get('saveboard');
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
  document.getElementById("quitButton").addEventListener("click", function() {
    remote.app.quit();
  });

  if(save.length == 81 && auto==1){ 
    document.getElementById("loadButton").disabled = false;
  }

  document.getElementById("loadButton").addEventListener("click", function(){
    loadGame();
  });

}

function loadGame(){
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

  answer = sudoku.solve(origboard);
  internalBoard = sudoku.board_string_to_grid(save);
  var dboard = sudoku.board_string_to_grid(origboard);
  console.log(origboard);
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      gamePieces[i][j].addEventListener("focusout", function(){
        if(auto==1){
        saveGame();
        }
      });
      if(dboard[i][j] != "."){
      gamePieces[i][j].value=internalBoard[i][j];
      gamePieces[i][j].disabled = true;
      } else {
        if(internalBoard[i][j] != "."){
        gamePieces[i][j].value=internalBoard[i][j];
        } else {
          gamePieces[i][j].value="";
        }
        gamePieces[i][j].disabled = false;
      }
    }
  }
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
  document.getElementById("diffButton").textContent = "Difficulty: " + difficulties[difficulty];
  document.getElementById("diffButton").addEventListener("click", function(){
    if(difficulty==5){
      difficulty = 0;
    } else {
      difficulty++;
    }
    store.set('difficulty', difficulty);
    document.getElementById("diffButton").textContent = "Difficulty: " + difficulties[difficulty];
  });

  document.getElementById("uiButton").textContent = "UI Scale: " + scale+"x";
  document.getElementById("uiButton").addEventListener("click", function(){
    if(scale==4){
      scale = 1;
    } else {
      scale++;
    }
    store.set('scale', scale);
    document.getElementById("uiButton").textContent = "UI Scale: " + scale+"x";
  });

  if(auto==1){
    document.getElementById("auto").textContent = "Saving: Enabled";
  } else {
    document.getElementById("auto").textContent = "Saving: Disabled";
  }

  document.getElementById("auto").addEventListener("click", function(){
    if(auto==0){
      document.getElementById("auto").textContent = "Saving: Enabled";
      auto=1;
    } else {
      document.getElementById("auto").textContent = "Saving: Disabled";
      auto=0;
    }
    store.set('save', auto);
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
  newGame();
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

  
}

function saveGame(){
  var myAnswer="";
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      if(gamePieces[i][j].value != ""){
      myAnswer=myAnswer + gamePieces[i][j].value;
      } else {
        myAnswer=myAnswer + ".";
      }
    }
  }
  store.set('savedata', myAnswer);
  store.set('saveboard', origboard);
}

function newGame(){
  var board = sudoku.generate(difficulties[difficulty].toLowerCase());
  answer = sudoku.solve(board);
  internalBoard = sudoku.board_string_to_grid(board);
  console.log(board);
  origboard = board;
  store.set("saveboard", origboard);
  store.set('savedata', "");
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      gamePieces[i][j].addEventListener("focusout", function(){
        if(auto==1){
        saveGame();
        }
      });
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
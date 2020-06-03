'use strict';
const {remote, shell}= require('electron');
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
  },
  rch: {
    type: 'number',
    maximum: 1,
    minimum: 0,
    default: 0
  },
  nh: {
    type: 'number',
    maximum: 1,
    minimum: 0,
    default: 0
  },
  autofill: {
    type: 'number',
    maximum: 1,
    minimum: 0,
    default: 0
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
var rch;
var nh;
var autofill;
var locked = false;

window.onload = function() {
    checkForUpdates();
    mainDiv = document.getElementById("main");
    difficulty = store.get('difficulty');
    auto=store.get('save');
    scale=store.get('scale');
    save=store.get('savedata');
    rch=store.get('rch');
    nh = store.get('nh');
    autofill=store.get('autofill');
    origboard=store.get('saveboard');
    this.navigateMenu();
}

function checkForUpdates(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      var versions = JSON.parse(this.responseText);
      var newVersion = versions[0].tag_name;
      console.log("Latest version: " + newVersion);
      var curVersion = document.getElementById("footer").innerHTML;
      console.log("Current version: " + curVersion);
      if(curVersion != newVersion){
        console.log("Version strings different, assuming an update (Possibly a pre-release?)");
        document.getElementById("footer").innerHTML = curVersion + " <a id=\"newver\" class=\"update\" href=\"\">Update available</a>";
        document.getElementById("newver").addEventListener("click", function(){
          shell.openExternal('https://github.com/Coppyhop/ckbsudoku/releases');
        });
      }
    }
  };
  xhttp.open("GET", "https://api.github.com/repos/Coppyhop/ckbsudoku/releases");
  xhttp.setRequestHeader("Accept", "application/vnd.github.v3.raw+json");
  xhttp.send();
}

function navigateMenu(){
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
  document.getElementById("mainMenuButton").addEventListener("click", function(){
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

  if(rch==1){
    document.getElementById("rchButton").textContent = "Row/Column Highlights: Enabled";
  } else {
    document.getElementById("rchButton").textContent = "Row/Column Highlights: Disabled";
  }

  document.getElementById("rchButton").addEventListener("click", function(){
    if(rch==0){
      document.getElementById("rchButton").textContent = "Row/Column Highlights: Enabled";
      rch=1;
    } else {
      document.getElementById("rchButton").textContent = "Row/Column Highlights: Disabled";
      rch=0;
    }
    store.set('rch', rch);
  });

  if(nh==1){
    document.getElementById("nhButton").textContent = "Number Highlights: Enabled";
  } else {
    document.getElementById("nhButton").textContent = "Number Highlights: Disabled";
  }

  document.getElementById("nhButton").addEventListener("click", function(){
    if(nh==0){
      document.getElementById("nhButton").textContent = "Number Highlights: Enabled";
      nh=1;
    } else {
      document.getElementById("nhButton").textContent = "Number Highlights: Disabled";
      nh=0;
    }
    store.set('nh', nh);
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
  document.getElementById("mainMenuButton").addEventListener("click", function(){
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

  for(var y=0;y<9;y++){
    for(var x=0;x<9;x++){
      let input = gamePieces[y][x];
      let r = y;
      let c = x;
      input.addEventListener("click", function(){
        if(rch==1){
          locked = true;
          select(r,c);
        }
      });

      input.addEventListener("focusout", function(){
        if(rch==1){
          locked = false;
          select(9,9);
        }
      });

      input.addEventListener("mouseenter", function(){
        if(nh==1){
          hover(this.value);
        }
      });

      input.addEventListener("mouseleave", function(){
        if(nh==1){
          if(!locked){
          select(9,9);
          }
        }
      });
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

function select(row, col){
    for(var i=0;i<9;i++){
      for(var j=0;j<9;j++){
        if(i==row || j == col){
          gamePieces[i][j].classList.add("cell-highlight");
        } else {
          gamePieces[i][j].classList.remove("cell-highlight");
        }
      }
    }
}

function hover(num){
  if(!locked){
    for(var i=0;i<9;i++){
      for(var j=0;j<9;j++){
        if(gamePieces[i][j].value==num){
          if(num > 0){
          gamePieces[i][j].classList.add("cell-highlight");
          }
        } else {
          gamePieces[i][j].classList.remove("cell-highlight");
        }
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
  var myAnswerSolve = sudoku.solve(myAnswer);
  if(myAnswer==answer || myAnswerSolve==myAnswer){
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
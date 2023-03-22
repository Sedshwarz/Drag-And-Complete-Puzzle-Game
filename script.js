var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var wrap = document.querySelector(".wrap");
var blocks = document.querySelectorAll(".block");
var file = document.getElementById("file");
var play = document.getElementById("play");
var btn = document.getElementById("btn");
var cancel = document.getElementById("cancel");
var counter = document.getElementById("counter");
var container = document.querySelector(".container");
var plates = document.querySelectorAll(".plate");
var a = 0, b = 0;
var control = false;
var elements = [];
var emptyNumber;

var fixAry = [];

for (var i = 0; i < 9; i++) {
  fixAry[i] = plates[i];
}


file.onchange = function(e) {
  var img = new Image();
  img.onload = draw;
  img.onerror = failed;
  img.src = URL.createObjectURL(this.files[0]);
  a = 0; b = 0;
};
function draw() {
  ctx.drawImage(this, 0,0,300,300);                                 // drawing uploaded image to our main canvas

  for (var i = 0; i < 9; i++) {
    var c = document.createElement("canvas");                       // new canvas element to get uploaded image's 100x100 parts
    var cx = c.getContext("2d");

    c.width = 100; c.height = 100;                                  // its size


    var imgData = ctx.getImageData(a, b, 100, 100);                // getting 100x100 part from main canvas
    cx.putImageData(imgData, 0, 0);                                // putting it to our new canvas

    var dataUrl = c.toDataURL();
    blocks[i].style.background = "url(" + dataUrl + ")";           // setting div background as new canvas data
    blocks[i].style.backgroundRepeat = "no-repeat";
    blocks[i].style.backgroundSize =  "cover";                     // div's background settings
    blocks[i].style.backgroundPosition = "center";

    c.remove();
    a += 100;
    if (a==300 && i==2) {
      b = 100;
      a = 0;                                                       // changing the coords for the parts
    }else if (a==300 && i!=2) {
      b = 200;
      a = 0;
    }
  }
}
function failed() {
  alert("The provided file couldn't be loaded as an Image media");
}







play.onclick = function(){
  if (control == false && file.value != "") {
    control = true;
    startGame();                                                                //when we clicked to play button
  }else {
    alert("Please first upload an image!");
  }
}


function startGame(){
  plates[8].children[0].style.display = "none";
  shuffleCards();                                                               // making last block invisible and running shuffle/clock functions
  startClock();
}





function shuffleCards(){
  elements = [];

  for (var i = 0; i < 9; i++) {
    elements[i] = fixAry[i].children[0];                                        // preparing blocks for random line
    elements = elements.sort(() => Math.random() - 0.5);
  }

  for (var i = 0; i < 9; i++) {
    container.children[i].innerHTML = "";                                       // putting blocks to the plates randomly
    container.children[i].appendChild(elements[i]);
  }


  play.style.display = "none";
  btn.style.display = "none";                                                   // buttons displaying stuffs
  cancel.style.display = "flex";

  if ((container.children[0].children[0].id == "0") && (container.children[1].children[0].id == "1") && (container.children[2].children[0].id == "2") && (container.children[3].children[0].id == "3") && (container.children[4].children[0].id == "4") && (container.children[5].children[0].id == "5") && (container.children[6].children[0].id == "6") && (container.children[7].children[0].id == "7") && (container.children[8].children[0].id == "8")) {
    shuffleCards();                                                             // if the line didn't change, run function again
  }

  emptyDiv = blocks[8].parentElement;
  emptyDiv.classList.add("empty");
  emptyNumber = emptyDiv.id;                                                    // setting which one is empty div and movement settings
  setMovement(emptyNumber);
}






var min = 6, sec = 60, minText = "", secText = "", clock;

function startClock(){
  counter.innerText = "07:00";
  minText = "06";
  secText = "60";

  clock = setInterval(function(){
    sec--;
    if (sec == 0) {
      sec = 60;
      minText = "0" + min;
      secText = "00";
      min--;
    }else if (sec<10) {                                                         // clock stuff, when the time run out the game is over
      secText = "0" + sec;
    }else if(sec>9) {
      secText = sec;
      minText = "0" + min;
    }


    counter.innerText = minText + ":" + secText;

    if (minText == "00" && secText == "00") {
      alert("Game Over");
      cancel.click();
    }

  },1000);

}





cancel.onclick = function(){
  play.style.display = "flex";
  btn.style.display = "flex";
  cancel.style.display = "none";
  clearInterval(clock);
  counter.innerText = "07:00";
  min = 2, sec = 60, minText = "", secText = "";

  for (var i = 0; i < 9; i++) {

    container.appendChild(fixAry[i]);                                           // all the events when cancel button clicked
    blocks[i].style.background = "#b6b5b5";
    blocks[i].style.display = "block";
    blocks[i].onmousemove = null;
    blocks[i].onmouseup = null;
    blocks[i].onmousedown = null;
    blocks[i].style.marginTop = "0px";
    blocks[i].style.marginLeft = "0px";
    document.getElementById(i+1).append(document.getElementById("b"+(i+1)));
  }

  control = false;
  file.value = "";
}






var startPos,startPosX,lastPosX,lastPosY, diff;
var movingCard, emptyDiv;

function dragElement(elmnt,func) {                                              // this func contains all the dragging func of the elmnt
  elmnt.style.zIndex = "100";
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;


  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;

    if (func=='right') {
      document.onmousemove = dragRight;
    }else if (func=='left') {                                                   //when we keep mouse down on blocks
      document.onmousemove = dragLeft;
    }else if (func=='above') {
      document.onmousemove = dragAbove;
    }else if(func=='below'){
      document.onmousemove = dragBelow;
    }

    startPosX = pos3;
    startPos = pos4;

    movingCard = this;
  }

  function dragBelow(e) {
    e = e || window.event;
    e.preventDefault();

    pos2 = pos4 - e.clientY;
    pos4 = e.clientY;
                                                                                // dragging below func
    if (pos4 - startPos < 104 && pos4 - startPos >= 0) {
      elmnt.style.marginTop = (elmnt.offsetTop - pos2) + "px";
      diff = pos4 - startPos;
    }

  }

  function dragAbove(e) {
    e = e || window.event;
    e.preventDefault();

    pos2 = pos4 - e.clientY;
    pos4 = e.clientY;                                                           // dragging above func

    if (startPos - pos4 > 0 && startPos - pos4 <= 104) {
      elmnt.style.marginTop = (elmnt.offsetTop - pos2) + "px";
      diff = startPos - pos4;
    }
  }

  function dragRight(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos3 = e.clientX;
                                                                                // dragging to right func
    if (pos3 - startPosX > 0 && pos3 - startPosX <= 104) {
      elmnt.style.marginLeft = (elmnt.offsetLeft - pos1) + "px";
      diff = pos3 - startPosX;
    }
  }

  function dragLeft(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos3 = e.clientX;                                                           // dragging to left func

    if (startPosX - pos3 > 0 && startPosX - pos3 < 104) {
      elmnt.style.marginLeft = (elmnt.offsetLeft - pos1) + "px";
      diff = startPosX - pos3;
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.style.zIndex = "1";
    if (diff>=50) {
      changeBlocks(movingCard,emptyDiv);                                        // mouseup func, it calls changeBlocks func if we moved >=50px
    }else {
      elmnt.style.marginLeft = "0px";
      elmnt.style.marginTop = "0px";
    }
  }

}







function changeBlocks(mCard,eDiv){

  var newEmpty = mCard.parentElement;
  if (eDiv.childElementCount == 1) {
    var rbds = eDiv.children[0];
    eDiv.children[0].remove();                                                  // if target plate has the invisible block(last), else just append it
    eDiv.appendChild(mCard);
    eDiv.appendChild(rbds);
  }else {
    eDiv.appendChild(mCard);                                                    // taking the selected card and appending it to the target plate
  }                                                                             // and setting new empty plate and setting new movements
  mCard.style.marginLeft = "0px";
  mCard.style.marginTop = "0px";
  newEmpty.classList.add("empty");
  eDiv.classList.remove("empty");
  emptyDiv = newEmpty;
  emptyNumber = emptyDiv.id;


  var cntr = 0;
  for (var a = 0; a < 8; a++) {
    if(plates[a].children[0] == blocks[a]){
      cntr++;
    }
  }
  if (cntr == 8) {
    wonGame();
  }else {
    setMovement(emptyNumber);
  }

}


function wonGame(){
  var lastCard = document.getElementById("b9");
  plates[8].appendChild(lastCard);
  lastCard.style.marginLeft = "0px";
  lastCard.style.marginTop = "0px";
  lastCard.style.display = "flex";
  wrap.classList.add("won");
  clearInterval(clock);
  counter.innerText = "Congratulations!";
  cancel.style.display = "none";

  setTimeout(function(){
    counter.innerText = "07:00";
    wrap.classList.remove("won");
    cancel.click();
  },3000);
}




function setMovement(x){

  for (var i = 0; i < 9; i++) {
    blocks[i].onmousemove = null;
    blocks[i].onmouseup = null;                                                 // setting every block's events null
    blocks[i].onmousedown = null;
  }

  if (x == 1) {
    dragElement(plates[1].children[0],'left');
    dragElement(plates[3].children[0],'above');
  }else if (x == 2) {
    dragElement(plates[0].children[0],'right');
    dragElement(plates[2].children[0],'left');
    dragElement(plates[4].children[0],'above');
  }else if (x == 3) {
    dragElement(plates[1].children[0],'right');
    dragElement(plates[5].children[0],'above');
  }else if (x == 4) {
    dragElement(plates[0].children[0],'below');
    dragElement(plates[4].children[0],'left');
    dragElement(plates[6].children[0],'above');
  }else if (x == 5) {                                                           // and setting new movements for the new empty plate
    dragElement(plates[1].children[0],'below');
    dragElement(plates[3].children[0],'right');
    dragElement(plates[5].children[0],'left');
    dragElement(plates[7].children[0],'above');
  }else if (x == 6) {
    dragElement(plates[2].children[0],'below');
    dragElement(plates[4].children[0],'right');
    dragElement(plates[8].children[0],'above');
  }else if (x == 7) {
    dragElement(plates[3].children[0],'below');
    dragElement(plates[7].children[0],'left');
  }else if (x == 8) {
    dragElement(plates[4].children[0],'below');
    dragElement(plates[6].children[0],'right');
    dragElement(plates[8].children[0],'left');
  }else if (x == 9) {
    dragElement(plates[5].children[0],'below');
    dragElement(plates[7].children[0],'right');
  }

}

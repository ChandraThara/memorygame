/*
 * Create a list that holds all of your cards
 */

const array = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

//card moves manipulation variables
let openCardsArray = [ ];
let tempArray = [ ];
let noOfWins = 0;
let noOfMoves = 0;
let moves = 0;
let matchedCardsLen = 0;
let match = false;
const cardsList = document.querySelectorAll ( 'li.card' ); //get all li elements with class name = card
const starEle = document.getElementById('starRating');
const starCount = 0;
const deck = document.getElementById('deck');
deck.style.pointerEvents = "none";//disable deck on load
moves = document.getElementById('totalMoves');
moves.innerHTML = noOfMoves+" Move";

//Congratulations message variables
const modalContainer = document.getElementById("modalContainer");
const modalDiv = document.getElementById("myModal");
const parent = deck.parentElement;
modalContainer.style.display = "none";
const modalMessage = document.getElementById('modalMessage');
const modalContent = document.getElementById('modalContent');

//timer logic variables
let hoursLabel = document.getElementById("hours");
let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
let totalTime = document.getElementById("totalTime");
let completionTime = 0;
let totalSeconds = 0;
let totalMinutes = 0;
let totalHours = 0;
let counter;
let timerOn;
let htmlResets;
let totalMills = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}

shuffle(array); //shuffle cards on page load
createCards(); //dynamically create cards on page load

/*
 * Create cards on page load
 *   - this is called after cards are shuffled
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function createCards() {
  for ( let i = 0; i < cardsList.length; i++ ) {
    const iList = cardsList[i].querySelector('i');
    iList.className = "fa"+" "+array[i]; //add shuffled cards to the UI
  }
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

for( let iCount = 0; iCount < cardsList.length; iCount++ ) {
  cardsList[ iCount ].addEventListener ( 'click', onClick ); //sets event listener for each card
}

/*
 * Show card to the Player
 * whenever a card is clicked.
 */

function onClick( evt) {
  startTimer(); //start timer on card click
  showCard( evt );
}

function showCard ( evt ) {
  if( openCardsArray.length === 2) {
    evt.stopPropogation();
  }
  if( evt.target.className === 'card') { //checking if clicked card's class name is card
    evt.target.className = 'card open show'; // open and show the clicked card
    addOpenCards(evt);
  }
}

/*
 * Add open cards to list of Open cards
 */

function addOpenCards ( evt) {
  const clickedCard = evt.target.querySelector('i.fa');
  if (evt.target.className === 'card open show') {
    openCardsArray.push(clickedCard.className);
    tempArray.push(clickedCard.parentElement);
    if (openCardsArray.length === 2) {
      setTimeout(function(){
        matchCards();
      }, 250);
    }
  }
}

/*
 * If openCardsArray has two elements then call this function
 *  -  Checks if both elements are the same( class of the opened card)
 *  -  If matches then show animation for the matched cards and increment no.of wins by 1
 *  -  If cards doesn't match then hide the unmatched cards
 */

function matchCards(evt) {
  if( openCardsArray.length === 2) {
    updateMoves();
    if( (openCardsArray[0] === openCardsArray[1]) ) { // when both cards have same class name
      match = true; // updating boolean value if cards match
      matchedCardsLen = matchedCardsLen + 2;
      animateMatchCards(evt,tempArray);
      openCardsArray = [ ]; //emptying storage array
      tempArray = [ ]; //emptying temp array
      noOfWins = noOfWins + 1; //increments no.of wins by 1
      if( noOfWins === 8) { // game complete
        finalScore();
        updateRating();
      }
    }
    else {
      match = false;
      animateMatchCards(evt,tempArray);
      setTimeout(function() {
        hideUnmatchedCards();
      }, 250);
    }
  }
}

/*
 * Function to animate the  cards
 *  - if matches, scale them
 *  - else rotate them and flip them back
 */

function animateMatchCards(evt,tempArray) {
  if(match) { //scale them if cards match
    for(let i = 0; i < 2; i++) {
      tempArray[i].style.transform = "scale(1.5)";
      tempArray[i].style.transitionDuration = "1s";
    }
    setTimeout( function() {
      // scales back the cards to original size
      for(let i = 0; i < 2; i++) {
        tempArray[i].style.transform = "scale(1)";
        tempArray[i].style.transitionDuration = "1s";
      }
    },250);
  }
  else { // rotate & flip them if cards doesn't match
    for(let i = 0; i < 2; i++) {
      tempArray[i].style.transform = "rotateX(360deg)";
      tempArray[i].style.transitionDuration = "1.5s";
    }
  }
}

/*
 * Hide unmatched cards
 */

function hideUnmatchedCards() {
  for(let i = 0; i < 2; i++) {
    tempArray[i].style.transform = '';
    tempArray[i].style.transitionDuration = '';
  }
  tempArray[0].className = 'card';
  tempArray[1].className = 'card';
  openCardsArray = [ ];
  tempArray = [ ];
}

/*
 * Shows final score of the player and activates the Congratulations window
 */

function finalScore() {
   modalContent.innerHTML = "You finished the game in " +noOfMoves+" moves";
   activateModal(true);
}

/*
 * Updates the star rating of the player based on no.of Moves
 * And timer taken to complete the game
 */

function updateRating() {
  starEle.innerHTML = '';
  let startsCount = document.getElementById('starUpdate');
  if(noOfMoves < 15 && completionTime < 20 ) { //3 star
    for( let i=0; i < 3; i++) {
      let li = document.createElement("li");
      let iClass = document.createElement("i");
      iClass.classList.add('fa');
      iClass.classList.add('fa-star');
      li.appendChild(iClass);
      starEle.appendChild(li);
    }
    startsCount.innerHTML = 3;
  }
  else if(noOfMoves < 20 && completionTime < 30) { //2 star
    for( let i=0; i < 2; i++) {
      let li = document.createElement("li");
      let iClass = document.createElement("i");
      iClass.classList.add('fa');
      iClass.classList.add('fa-star');
      li.appendChild(iClass);
      starEle.appendChild(li);
    }
    startsCount.innerHTML = 2;
  }
  else { //1 star
    let li = document.createElement("li");
    let iClass = document.createElement("i");
    iClass.classList.add('fa');
    iClass.classList.add('fa-star');
    li.appendChild(iClass);
    starEle.appendChild(li);
    startsCount.innerHTML = 1;
  }
}

/*
 * Function to update moves
 * - two card clicks considered as a move
 */

function updateMoves() {
  noOfMoves++;
  updateRating();
  if( noOfMoves <= 1 ) {
    moves.innerHTML = noOfMoves +" Move ";
  }
  else {
    moves.innerHTML = noOfMoves +" Moves ";
  }
}

/*
 * When game is complete, Congratulations message pops up, includes
 *  - completion time
 *  - updated starRating
 *  - total no.of moves to finish the game
 */

function activateModal(val) {
  if (true){
      modalContainer.style.display = "block";
      stopTimer();
      updateRating();
  }
}

/*
 * Resets game settings and reloads the page
 */

function restartGame() {
  parent.remove(modalContainer);
  window.location.reload();
}

/*
 * Function to enable and disable Start button
 */

let button = document.getElementById('startButton');
button.addEventListener('click',hideStartButton,false);

function hideStartButton() {
    document.getElementById('startGame').style.display = 'block';
    button.style.display = 'none';
    deck.style.pointerEvents = "auto";//enable deck
}

/*
 * Timer logic.
 * - starts on click of a card
 * - stops when game is complete
 */

function startTimer() {
  if (timerOn == 1) {
      return;
  }
  else {
      counter = setInterval(setTime, 10);
      timerOn = 1;
      htmlResets = 0;
  }
}

function stopTimer() {
  totalTime.innerHTML =  hoursLabel.innerHTML + ":" + minutesLabel.innerHTML + ":" + secondsLabel.innerHTML;
  completionTime = totalSeconds;
  totalMills = 0;
  totalSeconds = 0;
  totalMinutes = 0;
  totalHours = 0;
  clearInterval(counter);
  timerOn = 0;
}

function setTime() {
  ++totalMills;
  if (totalHours == 99 & totalMinutes == 59 & totalSeconds == 60) {
      totalHours = 0;
      totalMinutes = 0;
      totalSeconds = 0;
      hoursLabel.innerHTML = "00";
      minutesLabel.innerHTML = "00";
      secondsLabel.innerHTML = "00";
      clearInterval(counter);
  }
  if (totalMills == 100) {
      totalSeconds++;
      secondsLabel.innerHTML = pad(totalSeconds % 60);
      totalMills = 0;
  }
  if (totalSeconds == 60) {
      totalMinutes++;
      minutesLabel.innerHTML = pad(totalMinutes % 60);
      totalSeconds = 0;
  }
  if (totalMinutes == 60) {
      totalHours++;
      hoursLabel.innerHTML = pad(totalHours);
      totalMinutes = 0;
  }
}

function pad(val) {
  let valString = val + "";
  if (valString.length < 2) {
      return "0" + valString;
  }
  else {
      return valString;
  }
}

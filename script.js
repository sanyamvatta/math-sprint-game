// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';
// format and display time in dom

// refresh splash page best scores
function bestScoresToDOM(){
  bestScores.forEach((bestScore,index)=>{
    bestScore.textContent = `${bestScoreArray[index].bestScore}s`;
  })
}

// check local storage for best score
function getSavedBestScore(){
  if(localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.getItem('bestScores'));
  }else{
    bestScoreArray = [
      {questions : 10,bestScore: finalTimeDisplay},
      {questions : 25,bestScore: finalTimeDisplay},
      {questions : 50,bestScore: finalTimeDisplay},
      {questions : 99,bestScore: finalTimeDisplay},
    ];
    localStorage.setItem('bestScores',JSON.stringify(bestScoreArray))
  }
  bestScoresToDOM();
}

// update best score
function updateBestScore(){
  bestScoreArray.forEach((score,index)=>{
    console.log(score.questions)
    // Select correct best score
    if(questionAmount == score.questions){
      console.log('updating local storage')
      // return best score as a number with 1 decimal
      const savedBestScore = Number(score.bestScore)
      // Update if new final score is less or replacing 0
      if(savedBestScore== 0 || savedBestScore>finalTime ){
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  })
  bestScoresToDOM()
  // save to local storage
  localStorage.setItem('bestScores',JSON.stringify(bestScoreArray))
}

// play again (reset the game)
function playAgain(){
  gamePage.addEventListener('click',startTimer)
  scorePage.hidden = true;
  splashPage.hidden = false
  equationsArray = []
  playerGuessArray = []
  valueY = 0;
  playAgain.hidden = true;
}

// show score page
function showScorePage(){
  setTimeout(()=>{
    playAgainBtn.hidden = false;
  },1000)
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// show splash page

function scoresToDOM(){
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1)
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`
  penaltyTimeEl.textContent = `Penalty: + ${penaltyTime}s`
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // scroll to top of item container
  itemContainer.scrollTo({
    top: 0
  });
  showScorePage();
}

// stop timer and process results
function checkTime(){
  console.log(timePlayed)
  if(playerGuessArray.length == questionAmount){
    clearInterval(timer);
    // calculate final time which is base time + 0.5s penality for each wrong player guess
    playerGuessArray.forEach((guess,i)=>{
      if(guess!==equationsArray[i].evaluated){
        penaltyTime+=1
      }
    })
    finalTime = timePlayed + penaltyTime
    console.log(penaltyTime,finalTime)
    scoresToDOM();
  }
}

// Add 100 muliseconds to timeplayed
function addTime(){
  timePlayed += 0.1;
  checkTime()
}

// Start timer when game page clicked
function startTimer(){
  timePlayed = 0;
  baseTime = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime,100)
  gamePage.removeEventListener('click',startTimer)
}

// Scroll
let valueY = 0;

// scroll/store user selection
function select(guessedTrue){
  valueY+=80
  itemContainer.scroll(0,valueY);
  // add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}


// Displays Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get Random Number up to a certain amount
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('correct equations:', correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('wrong equations:', wrongEquations);
  // Loop through for each correct equation, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through for each wrong equation, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(2);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add Equations to DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation Text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Displays 3, 2, 1, GO!
function countdownStart() {
  let count = 3;
  countdown.textContent = count
  const interval = setInterval(() => {
    count--;
    countdown.textContent = count
    if (count === 0) {
      countdown.textContent = 'GO!'
    }else if(count==-1){
      clearInterval(interval);
      showGamePage()
    }
  },1000)
}

// Navigate from Splash Page to CountdownPage to Game Page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
}

// Get the value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides amount of Questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('question amount:', questionAmount);
  if (questionAmount) {
      showCountdown();
  }
}

// Switch selected input styling
startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove('selected-label');
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

// Event Listeners

startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);
// On Load;
getSavedBestScore();

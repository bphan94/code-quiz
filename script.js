// Quiz Elements:
var timerEl = document.querySelector("header span#time");
var startEl = document.querySelector("div.start");
var startButton = document.querySelector("button#start");
var questionDivEl = document.querySelector("div.questions");
var answerButtons = document.querySelector("div.buttons");
var questionEl = document.querySelector("h1#questions");
var rightWrongEl = document.querySelector("div#right-wrong");

// End Elements:
var endEl = document.querySelector("div.end");
var scoreEl = document.querySelector("h2 span#score");
var scoreForm = document.querySelector("form#score-form");
var initialsInput = document.querySelector("input#initials");

// Leaderboard Elements:
var leaderBoardLink = document.querySelector("header div#leaderboards");
var leaderBoardsList = document.querySelector("div.leaderboards-list");
var scoreBoard = document.querySelector("ol#score-board");
var clearLeader = document.querySelector("button#clear");
var backBtn = document.querySelector("button#back");

// Questions from:
// W3Schools JavaScript Quiz: https://www.w3schools.com/js/js_quiz.asp
var questionBank = [
    {
        question: "Inside Which HTML element do we put the Javascript?",
        possibleAns: ["a. <scripting>", "b. <js>", "c. <javascript>", "d. <script>"],
        correctAns: 3
    },
    {
        question: "How do you write 'Hello World' in an alert box?",
        possibleAns: ["a. alert('Hello World');", "b. alertBox('Hello World');", "c. msg('Hello World');", "d. msgBox('Hello World');"],
        correctAns: 0
    },
    {
        question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
        possibleAns: ["a. <script href='xxx.js'>", "b. <script name='xxx.js'>", "c. <script value='xxx.js'>", "d. <script src='xxx.js'>"],
        correctAns: 3
    },
    {
        question: "How do you create a function in JavaScript?",
        possibleAns: ["a. function = myFunction()", "b. function myFunction()", "c. function:myFunction()", "d. function=myFunction"],
        correctAns: 1
    },
    {
        question: "How do you write an IF statement in Javascript?",
        possibleAns: ["a. if (i === 5)", "b. if i = 5", "c. if i == 5 then", "d. if i = 5 then"],
        correctAns: 0
    },
    {
        question: "How do you write an IF statement for executing some code if 'i' is NOT equal to 5",
        possibleAns: ["a. if (i <> 5)", "b. if i =! 5 then", "c. if (i !== 5)", "d. if i <> 5"],
        correctAns: 2
    }

];


// Quiz Variables

var questionIdx = 0;  // track of current question
var secondsLeft = 60; // tracks time
var timerInterval; // timer interval
var flashTimeout; // timeout for wrong answers

// Functions to hide elements

function hide(element) {
    element.setAttribute("style", "display: none;");
}

function show(element) {
    element.setAttribute("style", "display: block;");
}


// Quiz Functions

// loading questions into html
function displayQuestion() {
    var currQuestion = questionBank[questionIdx]; // loads the current question from question bank
    questionEl.textContent = currQuestion.question; // puts question in the question heading
    // puts possible answers into answer buttons
    var possibleAnswers = currQuestion.possibleAns;
    for (var i = 0; i < possibleAnswers.length; i++) {
        answerButtons.children[i].textContent = possibleAnswers[i];
    }
}


// Ending of quiz. When time runs out this function runs
function endQuiz() {
    clearInterval(timerInterval); // clears the timer interval
    timerEl.textContent = 0; // sets the timer display to 0

    // makes sure score can't be a negative number
    if (secondsLeft < 0) {
        secondsLeft = 0;
    }

    scoreEl.textContent = secondsLeft;// display seconds left as score
    hide(questionDivEl); // hides questions div element
    show(endEl); // shows end element

}

// Starts timer and displays on screen
function startTimer() {
    timerInterval = setInterval(function () {
        secondsLeft--; // decrements time 
        timerEl.textContent = secondsLeft; // displays time left on top of screen
        // when timer runs out
        if (secondsLeft === 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000)
}

// Starts when start quiz button is clicked
function startQuiz() {
    // hides start element
    hide(startEl);
    // load question
    displayQuestion();
    // show question div
    show(questionDivEl);
    // start timer
    startTimer();
}

// Event listener to start the quiz when the Start Quiz button is clicked
startButton.addEventListener("click", startQuiz);


// loads the next question
function nextQuestion() {
    // checks to see if there are more questions in question bank
    // if there are more questions:
    if (questionIdx < questionBank.length - 1) {
        // increment the question index
        questionIdx++;
        // display the new question
        displayQuestion();
    } else {
        // no more questions left
        // display end screen 
        setTimeout(function () {
            endQuiz();
        }, 500)

    }
}

// check answers
function checkAnswer(answer) {
    if (questionBank[questionIdx].correctAns == answer) {
        // answer is right
        // flash right message for 1 second
        clearTimeout(flashTimeout);
        rightWrongEl.setAttribute("class", "right");
        rightWrongEl.textContent = "Right!";
        show(rightWrongEl);
        flashTimeout = setTimeout(function () {
            hide(rightWrongEl);
        }, 1000);
    } else {
        // answer is wrong
        // subtract time from clock
        secondsLeft -= 10;
        // flash wrong message for 1 second
        clearTimeout(flashTimeout);
        rightWrongEl.setAttribute("class", "wrong")
        rightWrongEl.textContent = "Wrong.";
        show(rightWrongEl);
        flashTimeout = setTimeout(function () {
            hide(rightWrongEl);
        }, 1000);
    }
    // loads the next question
    nextQuestion();
}

// Event listener for the four answer buttons - runs checkAnswer to check for right/wrong
answerButtons.addEventListener("click", function () {
    var element = event.target;
    if (element.matches("button")) {
        checkAnswer(element.value);
    }
})



// leaderboards 

// array to hold leaderboards

var scores = [];

// function to sort score
function compareScores(a, b) {
    return b.score - a.score;
}

// displays score ranking on leaderboards screen
function renderScores() {
    // hide other divs 
    hide(questionDivEl);
    hide(endEl);
    hide(startEl);

    // clear current scores on page
    scoreBoard.innerHTML = "";

    // sort from highest to lowest
    scores.sort(compareScores);

    // render scores on page in LIs
    for (var i = 0; i < scores.length; i++) {
        var li = document.createElement("li");
        li.textContent = `${scores[i].initials} - ${scores[i].score}`;
        scoreBoard.appendChild(li);
    }
    // show leaderboards div
    show(leaderBoardsList);
}

// updates localStorage
function storeScore() {
    localStorage.setItem("scores", JSON.stringify(scores));
}

// checks for scores in localStorage and loads them into scores array
function loadScores() {
    var storedScores = JSON.parse(localStorage.getItem("scores"));
    if (storedScores) {
        scores = storedScores;
    }
}

// load any high scores from local Storage
loadScores();

// Click listeners on leaderboards buttons

// Clear the leaderboards 
clearLeader.addEventListener("click", function () {
    localStorage.clear();
    scores = [];
    renderScores();
})

// back to the start screen
backBtn.addEventListener("click", function () {
    // clear timer
    clearInterval(timerInterval);
    // initialize quiz variables
    questionIdx = 0;
    secondsLeft = 60;
    // display seconds left
    timerEl.textContent = secondsLeft;
    // hide leaderboards div and show Start div
    hide(leaderBoardsList);
    show(startEl);
})

// Event listener for submitting leaderboards listing 
scoreForm.addEventListener("submit", function () {
    event.preventDefault();
    var initials = initialsInput.value.trim();
    // check to make sure form is not blank
    if (!initials) {
        return;
    }
    // create object with initials and score 
    var initialsScore = { initials: initials, score: secondsLeft };

    // add initials and score to scores array
    scores.push(initialsScore);

    // clear initials text input
    initialsInput.value = "";

    // update localStorage with scores array
    storeScore();
    // display leaderboards with scores listing
    renderScores();
})

// Event listener on leaderboards link at top of page to display the leaderboards screen
leaderBoardLink.addEventListener("click", function () {
    // clear timer if there is one
    clearInterval(timerInterval);
    // render the leaderboards score listing on the screen
    renderScores();
})











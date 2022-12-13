let gameState = null;
let answer = null;

function initGame() {
    let numbers = [];
    for (let i = 0; i < 4; i++) {
        let x = Math.floor(10 * Math.random());
        numbers.push(x);
    }
    document.getElementById("numbers").textContent = numbers.map(String).join("");

    let r = Math.floor(4 * Math.random());
    answer = numbers.slice(0, r).concat(numbers.slice(r+1, 4));
    for (let i = 2; i > 0; i--) {
        let j = Math.floor((i+1) * Math.random());
        let t = answer[j];
        answer[j] = answer[i];
        answer[i] = t;
    }
    answer = answer.map(String).join("");

    document.getElementById("attempts").replaceChildren();
    gameState = true;
}

function parseAttempt(guess) {
    if (!/^\d\d\d$/.test(guess))
        return false;

    let attempts = document.getElementById("attempts");
    let tn = document.createElement("span");
    tn.appendChild(document.createTextNode(guess));
    let li = document.createElement("li");
    li.appendChild(tn);
    attempts.appendChild(li);

    let matches = 0;
    for (let i = 0; i < 3; i++) {
        if (guess[i] === answer[i]) {
            matches++;
        }
    }
    if (matches == 0) {
        tn.style.color = "var(--del-color)";
    }
    else if (matches == 3) {
        gameState = false;
        tn.style.color = "var(--primary)";
    }
    else {
        tn.style.color = "var(--ins-color)";
    }

    return true;
}

window.onload = function() {
    let guess = document.getElementById("guess");
    initGame();

    guess.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            if (!gameState) {
                initGame();
            }
            else if (parseAttempt(guess.value)) {
                guess.value = "";
            }
            else {
                // bad input
                console.log("bad input '" + guess.value + "'");
            }
            guess.placeholder = gameState ? "Guess" : "New Game";
        }
    });
};

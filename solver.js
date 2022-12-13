let solverState = null;
let guesses = null;

function perms(xs) {
    if (xs.length == 0) {
        return [[]];
    }
    return xs.flatMap((x, i) => {
        return perms(xs.filter((v, j) => i!==j)).map(vs => [x, ...vs]);
    });
}

function updateGuesses() {
    let ranks = new Map();
    guesses.forEach(x => {
        let counts = [0, 0, 0];
        guesses.forEach(y => {
            let t = _.zip(x, y).map(z => z[0] === z[1] ? 1 : 0).reduce((a, b) => a + b, 0);
            counts[t - (t >> 1)]++;
        });
        let score = counts.filter(z => z > 0).map(z => z * Math.log2(guesses.length / z)).reduce((a, b) => a + b, 0) / guesses.length;
        if (!ranks.has(score)) {
            ranks.set(score, []);
        }
        ranks.get(score).push(x);
    });
    let best = _.max(Array.from(ranks.keys()));
    ranks.forEach((v, k) => {
        v.forEach(z => document.getElementById(z).style.color = k == best ? "var(--primary)" : "var(--ins-color)");
    });
}

function initSolver(input) {
    if (!/^\d\d\d\d$/.test(input))
        return false;

    document.getElementById("numbers").innerText = input;
    guesses = _.uniq(perms(input.split("")).map(x => x.join("").substring(1)));
    for (let i = 0; i < 4; i++) {
        let y = document.createElement("tr");
        document.getElementById("guesses").appendChild(y);
        for (let j = 0; j < 6; j++) {
            let k = 6 * i + j;
            if (k < guesses.length) {
                let z = document.createElement("td");
                z.appendChild(document.createTextNode(guesses[k]));
                z.setAttribute("id", guesses[k])
                y.appendChild(z);
            }
        }
    }
    updateGuesses();

    return true;
}

function parseGuess(input) {
    if (!/^\d\d\d$/.test(input))
        return false;

    if (!_.contains(guesses, input))
        return false;

    return true;
}

function parseMatch(guess, input) {
    if (!/^[ynd]$/.test(input))
        return false;

    let diff = [];
    if (input === "y") {
        guesses.forEach(x => {
            if (x === guess || _.every(_.zip(x, guess), y => y[0] !== y[1])) {
                document.getElementById(x).style.color = "var(--del-color)";
                diff.push(x);
            }
        });
    }
    else {
        guesses.forEach(x => {
            if (!_.every(_.zip(x, guess), y => y[0] !== y[1])) {
                document.getElementById(x).style.color = "var(--del-color)";
                diff.push(x);
            }
        });
    }
    guesses = _.difference(guesses, diff);

    return true;
}

window.onload = function() {
    let input = document.getElementById("input");
    let guess = null;
    solverState = 0;

    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            if (solverState == 0) {
                if (initSolver(input.value)) {
                    input.value = "";
                    input.placeholder = "Guess";
                    solverState = 1;
                }
            }
            else if (solverState == 1) {
                guess = input.value;
                if (parseGuess(guess)) {
                    input.value = "";
                    input.placeholder = "Match? (y/n/d)";
                    solverState = 2;
                }
            }
            else {
                if (parseMatch(guess, input.value)) {
                    if (input.value === "d") {
                        document.getElementById("numbers").innerText = "";
                        document.getElementById("guesses").replaceChildren();
                        input.placeholder = "Numbers";
                        solverState = 0;
                    }
                    else {
                        input.placeholder = "Guess";
                        updateGuesses();
                        solverState = 1;
                    }
                    input.value = "";
                }
            }
        }
    });
};

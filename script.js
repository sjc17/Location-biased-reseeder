function generate() {
    var rawtext = document.getElementById("participants").value;
    buildEntrants(rawtext);
}

function buildEntrants(text) {
    text += "\n";
    var regex = /\w.*\n/g;
    var entrants = [];
    var m;
    do {
        m = regex.exec(text);
        if (m) {
            entrants.push(m - "\n");
        }
    } while (m);
    buildBracket(entrants);
}

function buildBracket(entrants) {
    var bracketSize = entrants.length;
    var overallBracketSize = 2;
    while (overallBracketSize < bracketSize) {
        overallBracketSize *= 2;
    }
    // Number of byes = overall bracket size - real bracket size
}
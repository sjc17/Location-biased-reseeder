function generate() {
    var rawtext = document.getElementById("participants").value;
    
    //Build entrants
    rawtext += "\n";
    var regex = /\w.*\n/g;
    var entrants = [];
    var m;
    do {
        m = regex.exec(rawtext);
        if (m) {
            entrants.push(m - "\n");
        }
    } while (m);
    
    //Build bracket
    var bracketSize = entrants.length;
    var overallBracketSize = 2;
    while (overallBracketSize < bracketSize) {
        overallBracketSize *= 2;
    }
    // Number of byes = overall bracket size - real bracket size

}
function generate() {
    var genetic = Genetic.create();    

    var rawtext = document.getElementById("participants").value;
    
    // Build entrants

    // Allows the regexp to work properly if \n is added to the end
    rawtext += "\n";
    var regex = /.+(?=\n)/g;
    var entrants = [];
    var m;
    while(true) {
        m = regex.exec(rawtext);
        if (m === null) break;
        if (m[0].replace(/\s/g, '').length > 0) {
            entrants.push(m[0]);
        }
    }

    // Build bracket
    var bracketSize = entrants.length;
    var baseBracketSize = 2;
    var winnersRounds = 1;
    var winnersBracket = [];
    var losersBracket = [];
    
    while (baseBracketSize < bracketSize) {
        baseBracketSize *= 2;
        winnersRounds++;
    }

    // Number of byes = base bracket size - real bracket size
    for (var i = 0; i < baseBracketSize - bracketSize; i++) {
        // Add byes as null entrants
        entrants.push(null);
    }
    // Generate winners bracket

    winnersBracket[0] = [[0, 1]];
    for (var i = 1; i < winnersRounds; i++) {
        winnersBracket[i] = [];
        for (var j = 0; j < Math.pow(2, i - 1); j++) {
            winnersBracket[i].push([winnersBracket[i-1][j][0]]);
            winnersBracket[i].push([winnersBracket[i-1][j][1]]);            
        }
        for (var j = 0; j <  Math.pow(2, i); j++) {
            //winnersBracket[i][j].push(Math.pow(2, i + 1) + 1 - winnersBracket[i][j]);
            winnersBracket[i][j].push(Math.pow(2, i + 1) - 1 - winnersBracket[i][j]);
        }
    }
    
    console.log(winnersBracket);
    /*
    for (var i = 0; i < winnersRounds; i++) {
        winnersBracket[i] = [];
        for (var j = 0; j < Math.pow(2, i); j++) {
            winnersBracket[i].push([entrants[j],entrants[Math.pow(2, i + 1) - 1 - j]]);
        }
    }
    */

    // Generate losers bracket
    var losersRounds = (winnersRounds - 1) * 2;

    // Each loop in this for loop generates two rounds of losers bracket
    for (var i = 0; i < losersRounds/2; i ++) {
        // Generate first losers bracket round
    }
    //console.log(entrants);
}
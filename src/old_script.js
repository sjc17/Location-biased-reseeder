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
    // Array starts with Winners Finals and works backwards
    winnersBracket[0] = [[0, 1]];
    for (var i = 1; i < winnersRounds; i++) {
        winnersBracket[i] = [];
        for (var j = 0; j < Math.pow(2, i - 1); j++) {
            winnersBracket[i].push([winnersBracket[i-1][j][0]]);
            winnersBracket[i].push([winnersBracket[i-1][j][1]]);            
        }
        for (var j = 0; j <  Math.pow(2, i); j++) {
            winnersBracket[i][j].push(Math.pow(2, i + 1) - 1 - winnersBracket[i][j]);
        }
    }
    winnersBracket = winnersBracket.reverse();

    // Generate losers bracket

    // Generate first losers bracket round
    losersBracket[0] = [];
    for (var i = 0; i < winnersBracket[0].length; i += 2) {
        losersBracket[0].push(
            [
                winnersBracket[0][i][1], 
                winnersBracket[0][i+1][1]
            ]
        );
    }
    // Generate the second losers bracket round
    losersBracket[1] = [];
    for (var i = 0; i < winnersBracket[1].length; i++) {
        losersBracket[1].push([Math.max(...winnersBracket[1][winnersBracket[1].length - 1 - i]), Math.min(...losersBracket[0][i])]);
    }
    // Generate the rest of the losers rounds
    for (var i = 2; i < winnersRounds; i++) {
        losersBracket[2*i-2] = [];
        for (var j = 0; j < losersBracket[2*i-3].length; j += 2) {
            losersBracket[2*i-2].push(
                [
                    Math.min(...losersBracket[2*i-3][j]),
                    Math.min(...losersBracket[2*i-3][j+1])    
                ]                    
            );
        }
        losersBracket[2*i-1] = [];
        for (var j = 0; j < losersBracket[2*i-2].length/2; j++) {
            losersBracket[2*i-1].push(
                [
                    Math.min(...losersBracket[2*i-2][j]),
                    Math.max(...winnersBracket[i][j])
                ]
            );
        }
    }
    console.log(winnersRounds);
    console.log(winnersBracket);
    console.log(losersBracket);
}
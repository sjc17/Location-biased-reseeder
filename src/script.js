'use strict';
function generate() {
    let genetic = Genetic.create();
    let entrantList = getEntrants(genPools);
    console.log(homeRegion(entrantList));

    //genetic.optimize = Genetic.Optimize.Minimize;
    //genetic.select1.tournament2 = Genetic.Select1.Tournament2;
}

function getEntrants(callbackGenPools) {
    let rawText = document.getElementById("participants").value;
    let rawRegions = document.getElementById("regions").value;
    let poolCount = document.getElementById("pool-count").value;

    // Build entrants

    // Allows the regexp to work properly if \n is added to the end
    rawText += "\n";
    rawRegions += "\n";
    let regex = /.+(?=\n)/g;
    let regex2 = /.+(?=\n)/g;
    let entrants = [];
    let m;
    let n;
    let nonMatchingCounts = false;
    while(true) {
        m = regex.exec(rawText);
        n = regex2.exec(rawRegions);
        if (m === null && n === null) break;
        else if ((m === null && n !== null) || (m !== null && n === null)) {
            nonMatchingCounts = true;
            break;
        }
        // Checking that the line we are checking is not all whitespace
        if (m[0].replace(/\s/g, '').length > 0) {
            entrants.push(new Entrant(m[0], n[0], entrants.length));
        }
    }
    if (nonMatchingCounts) {
        alert("Warning: Entrant count does not match number of lines in region text box.");
        return null;
    }
    else if (entrants.length < 4 || entrants.length > 128) {
        alert("Entrant count must be between 4 and 128.");
        return null;
    }
    else {
        if (!poolCount) {
            alert("Please enter pool count.");
        }
        else {
            return callbackGenPools(entrants, poolCount);
        }
    }
}

function genPools(entrants, poolCount) {
    // Function will generate X number of pools from a list of entrants ordered by descending rank.

    // Reverse so that we can use Array.prototype.pop()
    let newEntrants = entrants.reverse();
    let ascendingSeeding = true;
    let i = 0;
    let j = 0;
    let pools = new Array(poolCount);
    for (let k = 0; k < poolCount; k++) {
        pools[k] = [];
    }

    while(j < 64 && newEntrants.length !== 0) {
        pools[i].push(newEntrants.pop());
        if ((i === poolCount - 1 && ascendingSeeding === true) || (i === 0 && ascendingSeeding === false)) {
            ascendingSeeding = !ascendingSeeding;
        }
        else if (ascendingSeeding) {
            i++;
        }
        else {
            i--;
        }
        j++;
    }
    return pools;
}

function homeRegion(entrants) {
    let regionCount = {};
    let max = 0;
    let home;
    for (let pool in entrants) {
        for (let entr in entrants[pool]) {
            if (!regionCount.hasOwnProperty(entrants[pool][entr].region)) {
                regionCount[entrants[pool][entr].region] = 1;
            }
            else {
                regionCount[entrants[pool][entr].region]++;
            }
        }
    }
    for (let key in regionCount) {
        if (regionCount[key] > max) {
            home = key;
            max = regionCount[key];
        }
    }
    return home;
}

function Entrant(name, region, originalSeed) {
    this.name = name;
    this.region = region;
    this.originalSeed = originalSeed;
}


// Saving this code for later. Currently I will be implementing seeding for pools only.

/*
const winnersBase = [];
winnersBase[0] = [[0, 1]];
for (var i = 1; i < 7; i++) {
    winnersBase[i] = [];
    for (var j = 0; j < Math.pow(2, i - 1); j++) {
        winnersBase[i].push([winnersBase[i-1][j][0]]);
        winnersBase[i].push([winnersBase[i-1][j][1]]);            
    }
    for (var j = 0; j <  Math.pow(2, i); j++) {
        winnersBase[i][j].push(Math.pow(2, i + 1) - 1 - winnersBase[i][j]);
    }
}

// This is less effort to hardcode manually than to generate with code
// trust me
const losersBase = [
    [[1,2]],
    [[2,3]],
    [[3,5],[2,4]],
    [[5,6],[4,7]],
    [[5,8],[6,11],[4,9],[7,10]],
    [[15,8],[12,11],[14,9],[13,10]],
    [[15,17],[8,22],[12,18],[11,21],[14,16],[9,23],[13,19],[10,20]],
    [[30,17],[25,22],[29,18],[26,21],[31,16],[24,23],[28,19],[27,20]],
    [[30,43],[17,36],[25,44],[22,35],[29,40],[18,39],[26,47],[21,32],[31,42],[16,37],[24,45],[23,34],[28,41],[19,38],[27,46],[20,33]],
    [[43,52],[36,59],[44,51],[35,60],[40,55],[39,56],[47,48],[32,63],[42,53],[37,58],[45,50],[34,61],[41,54],[38,57],[46,49],[33,62]],
    [[43,85],[52,74],[36,90],[59,69],[44,82],[51,77],[35,93],[60,66],[40,86],[55,73],[39,89],[56,70],[47,81],[48,78],[32,94],[63,65],[42,84],[53,75],[37,91],[58,68],[45,83],[50,76],[34,92],[61,67],[41,87],[54,72],[38,88],[57,71],[46,80],[49,79],[33,95],[62,64]],
    [[85,106],[74,117],[90,101],[69,122],[82,109],[77,114],[93,98],[66,125],[86,105],[73,118],[89,102],[70,121],[81,110],[78,113],[94,97],[65,126],[84,107],[75,116],[91,100],[68,123],[83,108],[76,115],[92,99],[67,124],[87,104],[72,119],[88,103],[71,120],[80,111],[79,112],[95,96],[64,127]]
];
*/
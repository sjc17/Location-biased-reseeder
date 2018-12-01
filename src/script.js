'use strict';
function generate() {
    let genetic = Genetic.create();
    genetic.entrantObjectList = getEntrants();
    if (genetic.entrantObjectList === null) {return;}
    genetic.home = homeRegion(genetic.entrantObjectList);
    genetic.poolCount = document.getElementById("pool-count").value;
    genetic.lockedSeeds = parseInt(document.getElementById("lock-top-seeds").value);
    genetic.advanceFromPools = document.getElementById("advance-from-pools").value;

    genetic.optimize = Genetic.Optimize.Minimize;
    genetic.select1 = Genetic.Select1.RandomLinearRank;

    genetic.seed = function() {
         // Fisher-Yates Shuffle
        let newArr = [...Array(this.entrantObjectList.length).keys()];
        /*
        let m = newArr.length;
        let swapIndex;
        let holdElement;
        while (m) {
            swapIndex = Math.floor(Math.random() * m--);

            holdElement = newArr[m];
            newArr[m] = newArr[swapIndex];
            newArr[swapIndex] = holdElement;
        }
        */
        return newArr; 
    }

    genetic.fitness = function (individual) {
        let fitness = this.penaltySameRegion(individual, this.entrantObjectList, this.home)
        + this.penaltySeedOffset(individual, this.entrantObjectList);
        return fitness;
    }

    genetic.mutate = function (individual) {
        return this.mutateSeeds(individual, this.lockedSeeds);
    }

    // Determines penalty to fitness for having regional conflict in a pool
    genetic.penaltySameRegion = function (seeds, entrantObjectList, home) {
        let pools = this.genPools(seeds);
        let penalty = 0;
    
        pools.forEach(function(pool) {
            for (let i = 0; i < pool.length - 1; i++) {
                for (let j = i+1; j < pool.length; j++) {
                    if ((entrantObjectList[pool[i]].region === entrantObjectList[pool[j]].region) && entrantObjectList[pool[i]] !== home) {
                        // This calculation will definitely require tweaking in the future
                        penalty += Math.abs(1/(entrantObjectList[pool[i]].originalSeed - entrantObjectList[pool[j]].originalSeed));
                    }
                }
            }
        });
        return penalty;
    }
    
    // Determines penalty to fitness for moving a seed away from its original
    genetic.penaltySeedOffset = function (seeds, entrantObjectList) {
        let penalty = 0;
        let totalSeeds = seeds.length;
        seeds.forEach(function(e) {
            penalty += Math.abs((entrantObjectList[e].originalSeed - seeds.indexOf(e))/totalSeeds);
        });
        return penalty;
    }    
    
    genetic.mutateSeeds = function (seeds, lock) {
        // Seeding chromosomal drift
        let newSeed = [...seeds];
        let driftSeed = Math.floor(lock + (Math.random() * (seeds.length - lock - 2)));
        newSeed = newSeed.slice(0, driftSeed).concat(newSeed[driftSeed + 1]).concat(newSeed[driftSeed]).concat(newSeed.slice(driftSeed + 2));
        return newSeed;
    }

    genetic.genPools = function (entrants) {
        // Function will generate X number of pools from a list of entrants ordered by descending rank.
    
        // Reverse so that we can use Array.prototype.pop()
        let newEntrants = [...entrants.slice().reverse()];
        let ascendingSeeding = true;
        let i = 0;
        let j = 0;
        let pools = new Array(this.poolCount);
        for (let k = 0; k < this.poolCount; k++) {
            pools[k] = [];
        }
    
        while(j < 64 && newEntrants.length !== 0) {
            pools[i].push(newEntrants.pop());
            if ((i === this.poolCount - 1 && ascendingSeeding === true) || (i === 0 && ascendingSeeding === false)) {
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

    genetic.generation = function (pop, generation, stats) {
        console.log(pop[0].entity);
        console.log("Gen "+generation);
        console.log("Best fitness "+stats.maximum);
        return;
    }

    genetic.notification = function(pop, generation, stats, isFinished) {
        if (isFinished) {
            alert('Done!');
        }
    }

    let config = {
        'size': 250,
        'mutation': 0.3,
        'iterations': 100,
        'webWorkers': true
    }

    genetic.evolve(config, {});
}

function getEntrants() {
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
    else if (entrants.length < 8 || entrants.length > 128) {
        alert("Entrant count must be between 8 and 128.");
        return null;
    }
    else {
        if (!poolCount) {
            alert("Please enter pool count.");
            return null;
        }
        else {
            return entrants;
        }
    }
}

function homeRegion(entrants) {
    let regionCount = {};
    let max = 0;
    let home;

    entrants.forEach(function(entr) {
        if (!regionCount.hasOwnProperty(entr.region)) {
            regionCount[entr.region] = 1;
        }
        else {
            regionCount[entr.region]++;
        }
    }); 
    
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

/*
function penaltySeedOffset(seeds, entrantObjectList) {
    let penalty = 0;
    let totalSeeds = seeds.length;
    console.log(seeds);
    seeds.forEach(function(e) {
        penalty += Math.abs((entrantObjectList[e].originalSeed - seeds.indexOf(e))/totalSeeds);
    });
    console.log("Seeding penalty: " + penalty);
    return penalty;
}
*/


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
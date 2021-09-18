const express = require("express");
const router = express.Router();
var fs = require('fs');

//fisher-yates algorithm for bias free shuffling and unique player matches
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

router.post("", (req, res, next) => {

    let mPlayers = new Array();
    let fPlayers = new Array();
    let resArr = new Array();

    for (let index = 0; index < req.body.playersMArr.length; index++) {

        mPlayers.push(req.body.playersMArr[index].name);
        fPlayers.push(req.body.playersFArr[index].name);

    }

    //shuffling using fisher yates algorithm
    shuffle(mPlayers);
    shuffle(fPlayers);

    console.log(mPlayers);
    console.log(fPlayers);

    for (let o = 0; o < mPlayers.length; o++) {

        const data = {
            mPlayer: mPlayers[o],
            fPlayer: fPlayers[o],
            result: sum(getOccurance(mPlayers[o], fPlayers[o]))
        }

        resArr.push(data);

        //reverse sorting array based on result and if same then sort by alphabetically descending
        resArr.sort(function (a, b) {

            return - (a.result - b.result || a.mPlayer.localeCompare(b.mPlayer));

        });

    }

    //console.log(resArr);

    const resultsTxt = fs.createWriteStream("output.txt");

    for (let k = 0; k < resArr.length; k++) {
        

        if(resArr[k].result >= 80){

            resultsTxt.write(resArr[k].mPlayer + " matches " + resArr[k].fPlayer + " by " + resArr[k].result + "% and is a good match");

        }

        else{
            
            resultsTxt.write(resArr[k].mPlayer + " matches " + resArr[k].fPlayer + " by " + resArr[k].result + "%");
        }

        resultsTxt.write("\r\n");
    }

    //gets occurance from names
    function getOccurance(firstName, secondName) {

        var occ = {};
        var text = firstName + " matches " + secondName;
        var str = text.toLowerCase().replace(/\s+/g, '');
        var arr = str.split('');

        var matchStringNum = "";

        for (var i = 0, c = arr.length; i < c; i++) {
            if (occ[arr[i]]) occ[arr[i]]++;
            else occ[arr[i]] = 1;
        }

        for (var i in occ) {
            matchStringNum += occ[i];
        }

        return matchStringNum;

    }

    //calculates match percentage
    function sum(num) {
        var numString = num.toString();
        var newString = "";
        while (numString.length > 1) { // (1)
            newString += (parseInt(numString[0]) + parseInt(numString[numString.length - 1])).toString(); // (2)
            numString = numString.substring(1, numString.length - 1); // (3)
        }
        newString += numString; // (4)

        if (newString.length > 2) { // (5)
            return sum(newString);
        } else {
            return newString;
        }

    }

    res.status(200).send({

        message: "Success"

      });

});

module.exports = router;
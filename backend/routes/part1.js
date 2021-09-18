const express = require("express");
const router = express.Router();

router.post("", (req, res, next) => {

  console.log(req.body.firstName);
  console.log(req.body.secondName);

  //gets occurance from names
  function getOccurance() {

    var occ = {};
    var text = req.body.firstName + " matches " + req.body.secondName;
    var str = text.toLowerCase().replace(/\s+/g, '');
    var arr = str.split('');

    var matchStringNum = "";

    for (var i = 0, c = arr.length; i < c; i++) {
      if (occ[arr[i]]) occ[arr[i]]++;
      else occ[arr[i]] = 1;
    }

    for (var i in occ) {
      console.log('count of ' + i + ' -> ' + occ[i]);
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
      console.log(newString)
      return sum(newString);
    } else {
      console.log(newString)

      res.status(200).send({

        message: newString

      });

      return newString;
    }

  }

  console.log(sum(getOccurance()));


});

module.exports = router;
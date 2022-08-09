/**
 * @filename    GrepDictionary.js
 * @Copyright   Wolfe Systems 2022
 * @purpose     RegEx searches a dictionary file to solve Wordle(like) puzzles
 *              
 */

function GrepDictionaryFile (greenParam, yellowParam, greyParam) {
    //console.log("DEBUG green", greenParam);
    //console.log("DEBUG yellow", yellowParam);
    //console.log("DEBUG grey", greyParam);
    
    return new Promise(function(resolve, reject) {
        
        if (greenParam.length === 0) greenParam = ".....";
        if (yellowParam.length === 0) yellowParam = ".....";

        var i, j;   // iterators
        // Validation
        if (greenParam.length !== 5)  reject("Error: green parameter must be empty or 5 characters, padded with .");
        if (yellowParam.length !== 5) reject("Error: yellow parameter must be empty or 5 characters, padded with .");
        //  greyParam.length can be 0 or more

        // validation green & yellow conflicts
        for (i = 0; i < greenParam.length ; i++) {
            for (j = 0; j < yellowParam.length; j++) {
                if (greenParam.substr(i, 1) !== "." && greenParam.substr(i, 1) === yellowParam.substr(j, 1)) {
                    reject("Error: green and yellow both contain: " + greenParam.substr(i, 1) );
                }
            }
        }
        // validation green & grey conflicts
        for (i = 0; i < greenParam.length ; i++) {
            for (j = 0; j < greyParam.length; j++) {
                if (greenParam.substr(i, 1) !== "." && greenParam.substr(i, 1) === greyParam.substr(j, 1)) {
                    reject("Error: green and grey both contain: " + greenParam.substr(i, 1) );
                }
            }
        }
        // validation yellow & grey conflicts
        for (i = 0; i < yellowParam.length ; i++) {
            for (j = 0; j < greyParam.length; j++) {
                if (yellowParam.substr(i, 1) !== "." && yellowParam.substr(i, 1) === greyParam.substr(j, 1)) {
                    reject("Error: yellow and grey both contain: " + yellowParam.substr(i, 1) );
                }
            }
        }
        // validation green & yellow conflicts
        for (i = 0; i < greenParam.length ; i++) {
            if (greenParam.substr(i, 1) !== "." && yellowParam.substr(i, 1) !== "." ) {
                reject("Error: green and yellow have conflicting values in position: " + (i+1));
            }
        }

        // Color Position Values
        // . | 1 letter
        var position1Green = greenParam.substr(0, 1); 
        var position2Green = greenParam.substr(1, 1); 
        var position3Green = greenParam.substr(2, 1); 
        var position4Green = greenParam.substr(3, 1); 
        var position5Green = greenParam.substr(4, 1); 

        // . | 1 letter
        var position1Yellow = yellowParam.substr(0, 1); 
        var position2Yellow = yellowParam.substr(1, 1); 
        var position3Yellow = yellowParam.substr(2, 1); 
        var position4Yellow = yellowParam.substr(3, 1); 
        var position5Yellow = yellowParam.substr(4, 1); 

        // Grep position values
        var position1RegExValue = ""; 
        var position2RegExValue = ""; 
        var position3RegExValue = ""; 
        var position4RegExValue = ""; 
        var position5RegExValue = ""; 
        var greyRegExValue   = greyParam;

        // POSITION VALUE LOGIC
        if (position1Green !== ".")
            position1RegExValue = position1Green;
        else
            position1RegExValue = "[^" + position1Yellow + greyRegExValue + "]";

        if (position2Green !== ".")
            position2RegExValue = position2Green;
        else
            position2RegExValue = "[^" + position2Yellow + greyRegExValue + "]";

        if (position3Green !== ".")
            position3RegExValue = position3Green;
        else
            position3RegExValue = "[^" + position3Yellow + greyRegExValue + "]";

        if (position4Green !== ".")
            position4RegExValue = position4Green;
        else
            position4RegExValue = "[^" + position4Yellow + greyRegExValue + "]";

        if (position5Green !== ".")
            position5RegExValue = position5Green;
        else
            position5RegExValue = "[^" + position5Yellow + greyRegExValue + "]";

        // Main RegEx filter
        var filter = ""; 
        filter += "^"; // start
        filter += "" + position1RegExValue; // . or a or [^xyz]
        filter += "" + position2RegExValue; // . or a or [^xyz]
        filter += "" + position3RegExValue; // . or a or [^xyz]
        filter += "" + position4RegExValue; // . or a or [^xyz]
        filter += "" + position5RegExValue; // . or a or [^xyz]
        filter += "$"; // end

        //console.log("RegEx filter:", filter);

        const fileReadPromise = ReadDictionaryFile(
            filter,             // RegEx
            position1Yellow,    // Possible match anywhere
            position2Yellow,    // Possible match anywhere
            position3Yellow,    // Possible match anywhere
            position4Yellow,    // Possible match anywhere
            position5Yellow);   // Possible match anywhere
        fileReadPromise
            .then((message) => {
                resolve(message);
            })
            .catch((message) => {
                reject(message);
            })
            .finally((message) => {
                // finally runs no matter what
            });
    
    }) // promise

} // function

function ReadDictionaryFile(regEx, pos1Match, pos2Match, pos3Match, pos4Match, pos5Match) {
    return new Promise(function(resolve, reject) {
        
        var grepResults = "";
        //console.log("RegEx:", regEx);
        //console.log("Yellows:", pos1Match, pos2Match, pos3Match, pos4Match, pos5Match);
        

        if (regEx.length === 0) reject("RegEx cannot be zero-length");
        if (    pos1Match.length === 0
            ||  pos2Match.length === 0
            ||  pos3Match.length === 0
            ||  pos4Match.length === 0
            ||  pos5Match.length === 0) 
            reject("All 5 yellow values must not be zero-length");

            // Read & loop thtu dictionary file
            const result = require("./dictionary.json");

            //fs.readFile("./dictionary.txt", "utf8", (err, data) => {
            var filter = regEx; 

            //console.log("RegEx filter:", filter);

            //var re = new RegExp(filter, "gm");  // global, multiline
            //var result = data.matchAll(re);
            
            for (const item of result) {
                // Also match any 5 yellows in the dictionary word
                if (RegExp(filter, "gm").test(item)
                    && RegExp(pos1Match, "gm").test(item)
                    && RegExp(pos2Match, "gm").test(item)
                    && RegExp(pos3Match, "gm").test(item)
                    && RegExp(pos4Match, "gm").test(item)
                    && RegExp(pos5Match, "gm").test(item)
                ) {
                    grepResults += item + "\n"; // append CR
                }                       
            } // for/of
                resolve(grepResults);
    
            //}); // fs.readfile
        
    }) // promise
} // function GrepDictionaryFile

//export default GrepDictionaryFile;
module.exports.GrepDictionaryFile = GrepDictionaryFile; 
/*
This program is free software: you can redistribute it and/or modify it 
under the terms of the GNU General Public License as published by the 
Free Software Foundation, either version 3 of the License, or 
(at your option) any later version.

This program is distributed in the hope that it will be useful, 
but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

See the GNU General Public License for more details.
*/

function GrepDictionaryFile (greenParam, yellowParam, greyParam) {
    
    return new Promise(function(resolve, reject) {
        
        // replace empty string as needed
        if (greenParam.length === 0)   greenParam = "....."; 
        if (yellowParam.length === 0) yellowParam = ".....";

        var i, j;   // iterators

        // Validation length
        if (greenParam.length !== 5)  reject("Error: green parameter must be empty or 5 characters, padded with .");
        if (yellowParam.length !== 5) reject("Error: yellow parameter must be empty or 5 characters, padded with .");
        //  greyParam.length can be 0 or more

        // Validation green & yellow conflicts
        for (i = 0; i < greenParam.length ; i++) {
            for (j = 0; j < yellowParam.length; j++) {
                if (greenParam.substr(i, 1) !== "." && greenParam.substr(i, 1) === yellowParam.substr(j, 1)) {
                    reject("Error: green and yellow both contain: " + greenParam.substr(i, 1) );
                }
            }
        }
        // Validation green & grey conflicts
        for (i = 0; i < greenParam.length ; i++) {
            for (j = 0; j < greyParam.length; j++) {
                if (greenParam.substr(i, 1) !== "." && greenParam.substr(i, 1) === greyParam.substr(j, 1)) {
                    reject("Error: green and grey both contain: " + greenParam.substr(i, 1) );
                }
            }
        }
        // Validation yellow & grey conflicts
        for (i = 0; i < yellowParam.length ; i++) {
            for (j = 0; j < greyParam.length; j++) {
                if (yellowParam.substr(i, 1) !== "." && yellowParam.substr(i, 1) === greyParam.substr(j, 1)) {
                    reject("Error: yellow and grey both contain: " + yellowParam.substr(i, 1) );
                }
            }
        }
        // Validation green & yellow conflicts
        for (i = 0; i < greenParam.length ; i++) {
            if (greenParam.substr(i, 1) !== "." && yellowParam.substr(i, 1) !== "." ) {
                reject("Error: green and yellow have conflicting values in position: " + (i+1));
            }
        }

        // Create Position Values
        // . or 1 letter
        var position1Green = greenParam.substr(0, 1); 
        var position2Green = greenParam.substr(1, 1); 
        var position3Green = greenParam.substr(2, 1); 
        var position4Green = greenParam.substr(3, 1); 
        var position5Green = greenParam.substr(4, 1); 

        // . or 1 letter
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
        filter += "" + position1RegExValue; // . or single letter or negate [^xyz]
        filter += "" + position2RegExValue; // . or single letter or negate [^xyz]
        filter += "" + position3RegExValue; // . or single letter or negate [^xyz]
        filter += "" + position4RegExValue; // . or single letter or negate [^xyz]
        filter += "" + position5RegExValue; // . or single letter or negate [^xyz]
        filter += "$"; // end

        const fileReadPromise = ReadDictionaryFile(
            filter,             // RegEx
            position1Yellow,    // Possible letter match anywhere
            position2Yellow,    // Possible letter match anywhere
            position3Yellow,    // Possible letter match anywhere
            position4Yellow,    // Possible letter match anywhere
            position5Yellow);   // Possible letter match anywhere
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

        if (regEx.length === 0) reject("RegEx cannot be zero-length");
        if (    pos1Match.length === 0
            ||  pos2Match.length === 0
            ||  pos3Match.length === 0
            ||  pos4Match.length === 0
            ||  pos5Match.length === 0) 
            reject("Error: Regular Expression and all 5 yellow values cannot be zero-length");

            // Read entire dictionary file into memory
            const dictionary = require("./dictionary.json");

            if (dictionary.count === 0) resolve("No matches"); //exits here

            var filter = regEx; 

            for (const word of dictionary) {
                // Test RegEx filter and possible yellows.  "gm" = global, multiline
                if (   RegExp(filter, "gm").test(word)      // test RegEx
                    && RegExp(pos1Match, "gm").test(word)   // test for yellow 1 in any position
                    && RegExp(pos2Match, "gm").test(word)   // test for yellow 2 in any position
                    && RegExp(pos3Match, "gm").test(word)   // test for yellow 3 in any position
                    && RegExp(pos4Match, "gm").test(word)   // test for yellow 4 in any position
                    && RegExp(pos5Match, "gm").test(word)   // test for yellow 5 in any position
                ) {
                    grepResults += word + "\n"; // append CR
                }                       
            } // for/of
            resolve(grepResults);       // all matching words returned
        
    }) // promise
} // function GrepDictionaryFile

export {GrepDictionaryFile}
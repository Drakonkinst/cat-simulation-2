const Database = (function() {
    const AsciiMap = {};
    return {
        get(id) {
            if(!AsciiMap.hasOwnProperty(id)) {
                return "";
            }
            return AsciiMap[id];
        },
        
        print(id) {
            if(!AsciiMap.hasOwnProperty(id)) {
                return;
            }
            let str = AsciiMap[id];
            if(str != null) {
                Logger.log(str);
            }
        },
        
        addAscii(id, asciiStr) {
            AsciiMap[id] = asciiStr.substring(1, asciiStr.length - 1);
            
        }
    };
})();

// http://www.ascii-art.de/ascii/c/cat.txt
Database.Init = function() {
Database.addAscii("cat", String.raw`
/\___/\
\ o.o /
'-.^.-'
  /"\
`);

Database.addAscii("room", String.raw`
+--------+
|        |
|        |
|        |
|        |
+--------+
`);
};


/** Candy Box
var Database;
(function (Database) {
    // Variables
    var asciiMap = {}; // A map which associates strings (the keys) to array of strings (the ascii arts)
    var asciiSizeMap = {}; // A map which associates strings (the keys) to the sizes of ascii arts
    var textMap = {}; // A map which associated strings (the keys) to strings (the texts)
    // Public functions
    function addAscii(asciiName, width, height, asciiArray) {
        asciiMap[asciiName] = asciiArray;
        asciiSizeMap[asciiName] = new Pos(width, height);
    }
    Database.addAscii = addAscii;
    function addText(key, text) {
        textMap[key] = text;
    }
    Database.addText = addText;
    function isTranslated() {
        if (Saving.loadString("gameLanguage") != "en")
            return true;
        return false;
    }
    Database.isTranslated = isTranslated;
    // Public getters
    function getAscii(key) {
        if (asciiMap[key] == null)
            console.log("Error : trying to access the unknown ascii art \"" + key + "\"");
        return asciiMap[key];
    }
    Database.getAscii = getAscii;
    function getAsciiHeight(key) {
        return asciiSizeMap[key].y;
    }
    Database.getAsciiHeight = getAsciiHeight;
    function getAsciiWidth(key) {
        return asciiSizeMap[key].x;
    }
    Database.getAsciiWidth = getAsciiWidth;
    function getPartOfAscii(key, y1, y2) {
        return getAscii(key).slice(y1, y2);
    }
    Database.getPartOfAscii = getPartOfAscii;
    function getText(key) {
        if (textMap["en." + key] == null)
            console.log("Error : trying to access the unknown text \"" + key + "\"");
        return textMap["en." + key];
    }
    Database.getText = getText;
    function getTranslatedText(key) {
        // If we have a language (other than english) selected
        if (Saving.loadString("gameLanguage") != "en") {
            // If the translated text can't be found
            if (textMap[Saving.loadString("gameLanguage") + "." + key] == null)
                console.log("Error : trying to access the unknown translated text \"" + key + "\" for language " + Saving.loadString("gameLanguage") + "."); // Error
            // If the translated text isn't chinese
            if (Saving.loadString("gameLanguage") != "zh")
                return textMap[Saving.loadString("gameLanguage") + "." + key]; // We just return the text
            else
                return textMap[Saving.loadString("gameLanguage") + "." + key].addChineseSpaces(); // We return the text after adding spaces
        }
        // Else, we return an empty string
        return "";
    }
    Database.getTranslatedText = getTranslatedText;
})(Database || (Database = {}));
 */
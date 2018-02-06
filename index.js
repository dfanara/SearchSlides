var pdf2text = require("pdf2text")
var fs = require("fs")
var loadedFiles = {}

/**
 * Gets all of the files in a directory that end with .pdf and do not start with a '.'
 */
function getSlides() {
    return fs.readdirSync(__dirname + "/slides").filter(file => !file.startsWith(".") && file.endsWith(".pdf"))
}

/**
 * Read all of the slides and save them to a JSON cache file.
 */
function readAllSlides() {
    var slides = getSlides()
    var runningPromises = 0

    for (var i = 0; i < slides.length; i++) {
        const file = slides[i]
        runningPromises++

        console.log("Started reading " + file)
        pdf2text(__dirname + "/slides/" + file).then(function(pages, err) {
            console.log("Finished reading " + file + " -- " + runningPromises + " togo.")
        
            loadedFiles[file] = pages
            runningPromises--
            if (runningPromises == 0) {
                fs.writeFileSync(__dirname + "/cached-files.json", JSON.stringify(loadedFiles).replace(/[^\x20-\x7E]/g, ''))
            }
        })
    }
}

/**
 * Find all occurences of a string in any of the PDF pages
 * 
 * @param s string to search in text for
 */
function searchCachedSlides(s) {
    for (var file in loadedFiles) {
        var pages = loadedFiles[file]
        var found = false
        for (var page = 0; page < pages.length; page++) {
            for (var line = 0; line < pages[page].length; line++) {
                // console.log(pages[page][line])
                if (pages[page][line].toLowerCase().indexOf(s.toLowerCase()) >= 0) {
                    console.log("\t" + file + ": " + pages[page][line].trim() + " -- on page " + page)
                    found = true
                }
            }
        }

        if (found === true)
            console.log("") // Add blank line between files
    }
}

if (!fs.existsSync(__dirname + "/cached-files.json")) {
    readAllSlides()
}else {
    loadedFiles = require(__dirname + "/cached-files.json")
    for (var i = 2; i < process.argv.length; i++) {
        const word = process.argv[i]

        // If we use quotes, keep pulling strings until we get the end quote
        if (word.startsWith("\"")) {
            while (!word.endsWith("\"")) {
                i++
                word += " " + process.argv[i]
            }
        }

        // Remove the quotes
        word.replace("\"", "");

        console.log("Searching for " + word)
        searchCachedSlides(word)
    }
}
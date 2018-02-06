# SearchSlides
Search all of your PDFs for keywords -- Easily search class slides.

# Installation
Clone this repository, and then run "npm install"
Put all of your slides as PDFs into the 'slides' directory. Then run, "node index.js" to build the cache file.

# Usage
"node index.js <search terms>"
ex. "node index.js foreign key" will search for foreign and key
ex. 'node index.js "foreign key"' will search for "foreign key"

# Notes
After adding or removing files from the slides directory, run "rm cached-files.json" to remove the cache.
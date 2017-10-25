console.log("LOADING TRANSLATIONS");

var fs = require('fs');
fs.access(__dirname + '/../manifest.json', (err, data) => {
  if(err) {
    console.log("ERROR!", err);
  } else {
    console.log("FILE AVAILABLE", data);
  }
});

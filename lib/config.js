const path = require('path');
const fs = require('fs');
const assumerConfigFile = path.join(process.cwd(),'.assumer.json');

fs.readFile(assumerConfigFile, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data.toString());
  }
});

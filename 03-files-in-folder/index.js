const fs = require("fs");
const path = require("path");
const folderPath = path.join(__dirname, "secret-folder");

fs.readdir(folderPath, (err, files) => {
  if (err) {
    throw err;
  }
  for (let file of files) {
    let filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        throw err;
      }
      if (stats.isFile()) {
        let fileName = path.basename(file, path.extname(file));
        let fileExtension = path.extname(file).slice(1);
        let fileSize = `${stats.size / 1000}kb`;
        console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
      }
    });
  }
});

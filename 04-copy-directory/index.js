const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "files");
const folderPathCopy = path.join(__dirname, "files-copy");

fs.access(folderPathCopy, (err) => {
  if (err) {
    fs.mkdir(folderPathCopy, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      throw err;
    }
    for (let file of files) {
      let filePath = path.join(folderPath, file);
      let filePathCopy = path.join(folderPathCopy, file);

      fs.copyFile(filePath, filePathCopy, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  });
});

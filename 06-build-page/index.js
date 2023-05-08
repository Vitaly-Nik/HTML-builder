const fs = require("fs");
const path = require("path");

function checkFolderAndCreate(folderPath) {
  fs.access(folderPath, (err) => {
    if (err) {
      fs.mkdir(folderPath, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  });
}

// create project-dist folder
const projectDistPath = path.join(__dirname, "project-dist");
checkFolderAndCreate(projectDistPath);

// copy assets-directory
const assetsPath = path.join(__dirname, "assets");
const assetsCopyPath = path.join(projectDistPath, "assets");

checkFolderAndCreate(assetsCopyPath);
fs.readdir(assetsPath, (err, files) => {
  if (err) {
    throw err;
  }
  for (let file of files) {
    let filePath = path.join(assetsPath, file);
    let fileCopyPath = path.join(assetsCopyPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        fs.copyFile(filePath, fileCopyPath, (err) => {
          if (err) throw err;
        });
      } else {
        checkFolderAndCreate(fileCopyPath);
        fs.readdir(filePath, (err, childfiles) => {
          if (err) {
            throw err;
          }
          for (let childfile of childfiles) {
            let childfilePath = path.join(filePath, childfile);
            let childfileCopyPath = path.join(fileCopyPath, childfile);
            fs.copyFile(childfilePath, childfileCopyPath, (err) => {
              if (err) throw err;
            });
          }
        });
      }
    });
  }
});

// merge-styles
const stylesFolderPath = path.join(__dirname, "styles");
const newStylesPath = path.join(__dirname, "project-dist", "style.css");
let newStyles = fs.createWriteStream(newStylesPath);

fs.readdir(stylesFolderPath, (err, files) => {
  if (err) {
    throw err;
  }
  for (let file of files) {
    if (path.extname(file) === ".css") {
      let filePath = path.join(stylesFolderPath, file);
      let stream = fs.createReadStream(filePath);
      let data = "";
      stream.on("data", (chunk) => newStyles.write((data += chunk)));
    }
  }
});

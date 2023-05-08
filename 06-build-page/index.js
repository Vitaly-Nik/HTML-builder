const fs = require("fs");
const path = require("path");
const projectDistPath = path.join(__dirname, "project-dist");

// create project-dist folder
function creatFolder() {
  fs.mkdir(projectDistPath, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });
}
// merge-html
function mergeHtml() {
  const templatePath = path.join(__dirname, "template.html");
  const componentsPath = path.join(__dirname, "components");

  fs.readFile(templatePath, "utf-8", (err, data) => {
    if (err) throw err;
    let templateData = data;

    fs.readdir(componentsPath, (err, data) => {
      if (err) throw err;

      for (let file of data) {
        let filePath = path.join(componentsPath, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            throw err;
          }
          if (stats.isFile() && path.extname(file) === ".html") {
            let fileName = path.basename(file, path.extname(file));

            fs.readFile(filePath, "utf-8", (err, data) => {
              if (err) throw err;
              templateData = templateData.replace(`{{${fileName}}}`, `${data}`);
              const indexHtmlPath = path.join(projectDistPath, "index.html");
              const stream = fs.createWriteStream(indexHtmlPath);
              stream.write(templateData);
            });
          }
        });
      }
    });
  });
}
// copy assets-directory
function copyAssets() {
  const assetsPath = path.join(__dirname, "assets");
  const assetsCopyPath = path.join(projectDistPath, "assets");

  fs.access(assetsCopyPath, (err) => {
    if (err) {
      fs.mkdir(assetsCopyPath, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  });

  fs.readdir(assetsPath, (err, files) => {
    if (err) {
      throw err;
    }
    for (let file of files) {
      let filePath = path.join(assetsPath, file);
      let fileCopyPath = path.join(assetsCopyPath, file);

      fs.stat(filePath, async (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          fs.copyFile(filePath, fileCopyPath, (err) => {
            if (err) throw err;
          });
        } else {
          fs.access(fileCopyPath, (err) => {
            if (err) {
              fs.mkdir(fileCopyPath, (err) => {
                if (err) {
                  throw err;
                }
              });
            }
          });

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
}

// merge-styles
function mergeStyles() {
  const stylesFolderPath = path.join(__dirname, "styles");
  const newStylesPath = path.join(projectDistPath, "style.css");
  const newStyles = fs.createWriteStream(newStylesPath);

  newStyles.on("error", (err) => {
    console.error(`Error writing to file: ${err}`);
  });

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
}

creatFolder();
mergeHtml();
copyAssets();
mergeStyles();

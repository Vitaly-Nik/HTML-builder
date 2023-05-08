const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "styles");
const bundlePath = path.join(__dirname, "project-dist", "bundle.css");
let bundle = fs.createWriteStream(bundlePath);

fs.readdir(folderPath, (err, files) => {
  if (err) {
    throw err;
  }
  for (let file of files) {
    if (path.extname(file) === ".css") {
      let filePath = path.join(folderPath, file);
      let stream = fs.createReadStream(filePath);
      let data = "";
      stream.on("data", (chunk) => bundle.write((data += chunk)));
    }
  }
});

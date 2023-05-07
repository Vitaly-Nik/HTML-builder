const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { stdin, stdout } = require("process");

const filePath = path.join(__dirname, "text.txt");
const rl = readline.createInterface(stdin, stdout);
const stream = fs.createWriteStream(filePath, "utf-8");

// Приветствие
console.log('Привет. Введите текст и нажмите Enter чтобы записать его в файл. Чтобы завершить работу, нажмите CTRL+C или в новой строке введите "exit" и нажмите Enter');

//  Действия при нажатии ctrl+c
rl.on("SIGINT", () => {
  console.log("Текст сохранён в файл. До встречи.\n");
  rl.close();
});

//  Действия при вводе текста
rl.on("line", (line) => {
  if (line === "exit") {
    console.log("Работа завершена. До встречи.\n");
    rl.close();
  } else {
    stream.write(`${line}\n`);
  }
});

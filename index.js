// run `node index.js` in the terminal

const express = require('express');

// console.log(express);

const server = express();

//localhost:3000/curso
server.get('/curso', (req, res) => {
  return res.send('Hello World!');
});

server.listen(3000);

console.log(`Hello Node.js v${process.versions.node}!`);

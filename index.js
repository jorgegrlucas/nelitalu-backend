// run `node index.js` in the terminal

console.log('Iniciando server...')

const express = require('express');

// console.log(express);

const server = express();

//localhost:3000/curso
server.get('/curso/:id', (req, res) => {
  const nome = req.query.nome;
  const id = req.params.id;

  // return res.json({curso: `Aprendendo ${id}`});
  return res.json({curso: `Aprendendo ${nome}`});
});

server.listen(3000);
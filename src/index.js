// run `node index.js` in the terminal

console.log('Iniciando server...')

const express = require('express');

const server = express();

server.use(express.json());

const cursos = ['NodeJS', 'JavaScript', 'Angular'];

//MIDDLEWARE
server.use((req,res,next) => {
    console.log(`"Url chamada: " ${req.url}`)

    return next();
});

function checkCurso(req,res,next){
  if(!req.body.name){
    return res.status(400).json({ error : "Nome do curso é obrigatório!"})
  }
  return next();
}

function checkIndexCurso(req,res,next){
  const curso = cursos[req.params.index];

  if(!curso){
    return res.status(400).json({ error : "O curso não existe!"})
  }
  return next();
}

//GET ALL
server.get('/cursos', (req, res) => {

  return res.json(cursos);

});

//GET INDEX
server.get('/cursos/:index', checkIndexCurso, (req, res) => {
  const { index } = req.params;


  return res.json(cursos[index]);

});

//CREATE
server.post('/cursos', checkCurso ,(req, res) => {
  const { name } = req.body;
  cursos.push(name);

  return res.json(cursos);
});

//UPDATE
server.put('/cursos/:index',checkCurso, checkIndexCurso, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  cursos[index] = name

  return res.json(cursos);
});

//DELETE
server.delete('/cursos/:index', checkIndexCurso, (req, res) => {
  const { index } = req.params;
  cursos.splice(index,1);

  return res.json(cursos);
});

server.listen(3000);

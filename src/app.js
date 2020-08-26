const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const validateRepository = (request, response, next) => {
  const {id} = request.params
  const repository = repositories.find(repo => repo.id === id)

  if(!repository){
    return response.status(400).send()
  }
  next()
}

const repositories = [];



app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body

  const repository = {id: uuid(), title,url,techs, likes:0}
  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id",validateRepository, (request, response) => {
  const {id} = request.params
  const {title,url,techs} = request.body
 
  repositories.forEach(repo => {
    if(repo.id === id){
      repo.title = title
      repo.url = url
      repo.techs = techs
    }
  })

  response.json(repositories.find(repo => repo.id === id))

});

app.delete("/repositories/:id", validateRepository, (request, response) => {
 
  repositories.forEach(v => repositories.splice(repositories.indexOf(v),1))

  return response.status(204).json(repositories)

});

app.post("/repositories/:id/like",validateRepository, (request, response) => {
  const {id} = request.params
  
  const repository = repositories.find(repo => repo.id === id)

  repository.likes +=1

  return response.json(repository)

});

module.exports = app;

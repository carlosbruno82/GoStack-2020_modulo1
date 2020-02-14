const express = require('express')

const server = express()

server.use(express.json())

const users = ['Carlos', 'Bruno', 'Teixeira']

// middleware global
server.use((req, res, next) => {
  console.time('Request')  // log inicio contagem

  next()

  console.timeEnd('Request') // log fim contagem
})

// middleware local ( POST, PUT) body
function checkUserExists(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({ error: 'User name is required' })
  }

  return next()
}

// middleware local (GET, PUT, DELETE) params
function checkUserInArray(req, res, next) {
  const user = users[req.params.index] 
  if(!user) {
    return res.status(400).json({ error: 'User does not exists' })
  }

  req.user = user

  return next()
}


// Listar todos usuários
server.get('/users', (req, res) => {

  return res.json(users)
})


// Listar um usuário
server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user) // req.user que fica dentro da funcção checkUserInArray
})

// Criar usuário
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body

  users.push(name)

  return res.json(users)
})

// Edição de usuário
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params

  const { name } = req.body

  users.splice(index, index, name)
  // users[index] = name;
  return res.json(users)
})

// Exclusão de usuário
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params

  users.splice(index, 1)   // vai chegar no index e deletar tanta posição. no caso 1 ele mesmo.

  return res.send()
})

server.listen(3000)
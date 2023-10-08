const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const User = require('./models/user')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))

app.get('/api/users', (req, res) => {
  User.find({}).then((users) => {
    res.json(users)
  })
})

app.post('/api/users', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.age || !body.sex || !body.height || !body.weight) {
    return response.status(400).json({
      error: 'Required fields missing in the request body',
    })
  }
  const user = new User({
    name: body.name,
    age: body.age,
    sex: body.sex || 'male',
    height: body.height,
    weight: body.weight,
  })

  user
    .save()
    .then((savedUser) => {
      response.json(savedUser)
    })
    .catch((error) => next(error))
})

app.get('/api/users/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json(user)
    })
    .catch((error) => next(error))
})

app.delete('/api/users/:id', (request, response, next) => {
  User.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

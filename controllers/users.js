const usersRouter = require('').Router()
const User = require('../models/user')

usersRouter.get('/api/users', (req, res) => {
  User.find({}).then((users) => {
    res.json(users)
  })
})

usersRouter.post('/api/users', (request, response, next) => {
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

usersRouter.get('/api/users/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json(user)
    })
    .catch((error) => next(error))
})

usersRouter.delete('/api/users/:id', (request, response, next) => {
  User.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = usersRouter

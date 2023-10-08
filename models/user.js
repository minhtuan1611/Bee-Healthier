const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
  },
  age: {
    type: Number,
    required: true,
    min: 9,
  },
  sex: String,
  height: {
    type: Number,
    required: true,
    min: 0,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('User', userSchema)

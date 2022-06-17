const { Schema, model } = require('mongoose')

const phonebookSchema = new Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: v => {
        return /\d{3}-\d*/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = model('Person', phonebookSchema)

module.exports = Person

require('dotenv').config()
require('./mongo.js')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person.js')
const notfound = require('./middleware/notfound.js')
const errorHandler = require('./middleware/errorHandler.js')

const app = express()
app.use(express.json())
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
// app.use(express.static('build'))
app.use(cors())

app.get('/api/persons', (req, res) => {
  Person.find({}).then(phonebook => res.json(phonebook))
})

app.get('/info', (req, res) => {
  Person.find({}).then(phonebook => {
    const timeNow = new Date().toUTCString()
    const html = `
        <div>
            <p>PhoneBook has info for ${phonebook.length} people</p>
            <p>${timeNow}</p>
        </div>
    `
    res.send(html)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  Person.findById(id)
    .then(person => res.json(person))
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  Person.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (req, res, next) => {
  const person = req.body

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  newPerson.save()
    .then(savedNote => res.json(savedNote))
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const person = req.body
  console.log(person)

  const newPersonInfo = {
    name: person.name,
    number: person.number
  }
  Person.findByIdAndUpdate(id, newPersonInfo, { new: true })
    .then(result => res.json(result))
    .catch(err => next(err))
})

app.use(errorHandler)
app.use(notfound)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

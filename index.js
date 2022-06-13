const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
morgan.token('body', req => {
    return JSON.stringify(req.body)
})
app.use(express.static('build'))
app.use(cors())


let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons' ,(req, res) => {
    res.json(phonebook)
})

app.get('/info', (req, res) => {
    const entries = phonebook.length
    const timeNow = new Date().toUTCString()
    const html = `
        <div>
            <p>PhoneBook has info for ${entries} people</p>
            <p>${timeNow}</p>
        </div>
    `
    res.send(html)
})

app.get('/api/persons/:id', (req, res) => {
    const id =  Number(req.params.id)
    const personToShow = phonebook.find(person => person.id === id)
    if(personToShow) res.json(personToShow)
    else {
        res.status(404).json({error: `Person with id ${id} does not exist`}).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const newPhoneBook = phonebook.filter(person => person.id !== id)
    if(newPhoneBook.length === phonebook.length) {
        res.status(404).json({error: `Perosn with id ${id} does not exist`}).end()
    } else {
        phonebook = newPhoneBook
        res.status(200).json(`Person with id ${id} was deleted sucessfully`)
    }
})

app.post('/api/persons',morgan(':method :url :status :res[content-length] - :response-time ms :body') ,(req, res) => {
    const requestBody = req.body
    const notDuplicateNames = phonebook.find(person => person.name === requestBody.name)
    if (requestBody.name === undefined && requestBody.number === undefined) res.status(400).json({error: 'name or number is missing'}).end()
    else if (notDuplicateNames !== undefined) res.status(400).json({error: `name ${notDuplicateNames.name} alredy exists`})
    else {
        const ids = phonebook.map(person => person.id)
        const personToAdd = {
            id: Math.max(...ids) + 1,
            name: requestBody.name,
            number: requestBody.number
        }
        phonebook = phonebook.concat(personToAdd)
        res.status(201).json(personToAdd)

    }
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
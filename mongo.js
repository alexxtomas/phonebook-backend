const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

mongoose.connect(connectionString)
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err))

// EXERCISE 3.12
// const Person = require('./models/Person.js')

// const params = process.argv

// if (params.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url = `mongodb+srv://alex:${password}@cluster0.fy3jq84.mongodb.net/alexdb?retryWrites=true&w=majority`

// mongoose.connect(url)
//   .then(() => console.log('Database connected'))
//   .catch(err => console.error(err))
// if (params.length === 3) {
//   Person.find({})
//     .then(persons => {
//       const phonebook = persons
//       console.log('phonebook:')
//       phonebook.map(person => console.log(person.name, person.number))
//       mongoose.connection.close()
//     })
// } else if (params.length === 5) {
//   const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4]
//   })
//   person.save().then(result => console.log(`added ${result.name} number ${result.number} to phonebook`))
// } else {
//   console.log('usage example: node mongo.js <password> <name> <number>')
// }

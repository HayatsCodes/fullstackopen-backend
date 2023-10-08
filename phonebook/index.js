const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :body'));

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

// const generateId = () => {
//     const min = 1;
//     const max = 10000001;
//     const randomNumber = Math.floor(Math.random() * (max - min)) + min;
//     return randomNumber;
//   }

app.post('/api/persons', async (req, res) => {
    const {name, number} = req.body;

    if (!name || !number) {
        return res.status(400).json({error: 'name or number is missing'})
    }

    if (await Person.findOne({name})) {
        return res.status(400).json({ error: 'name must be unique' })
    }


    // const id = generateId();

    const newPerson = new Person({name, number})

    const returnedPerson = await newPerson.save()


    return res.status(201).json(returnedPerson)
})

app.get('/api/persons', async (req, res) => {
    const persons = await Person.find({})
    res.json(persons) 
})

app.get('/api/persons/:id', async (req, res) => {
    const id = req.params.id
    const person = await Person.findById(id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', async (req, res) => {
    const id = req.params.id
    await Person.findByIdAndDelete(id)
   res.status(204).end()
})

app.get('/info', async (req, res) => {
  const peopleCount = (await Person.find({})).length
    res.send(
        `<p>Phonebook has info for ${peopleCount} people ${new Date(Date.now()).toString()}</p>`
    )
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 


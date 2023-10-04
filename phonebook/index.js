const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))


let persons = [
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

const generateId = () => {
    const min = 1;
    const max = 10000001;
    const randomNumber = Math.floor(Math.random() * (max - min)) + min;
    return randomNumber;
  }

app.post('/api/persons', (req, res) => {
    const {name, number} = req.body;

    if (!name || !number) {
        return res.status(400).json({error: 'name or number is missing'})
    }

    if (persons.find(person => person.name === name)) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    const id = generateId();

    const newPerson = {name, number, id}

    persons = persons.concat(newPerson)

    return res.status(201).json(newPerson)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    console.log(person)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id === id)
   res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for 2 people</p> ${new Date(Date.now()).toString()}`
    )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 
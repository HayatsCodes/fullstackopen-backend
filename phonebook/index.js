const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");
const PORT = process.env.PORT || 3001;

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms :body"));

app.post("/api/persons", async (req, res, next) => {
  try {
    const { name, number } = req.body;

    if (!name || !number) {
      return res.status(400).json({ error: "name or number is missing" });
    }

    if (await Person.findOne({ name })) {
      return res.status(400).json({ error: "name must be unique" });
    }

    const newPerson = new Person({ name, number });

    const returnedPerson = await newPerson.save();

    return res.status(201).json(returnedPerson);
  } catch (error) {
    next(error);
  }
});

app.get("/api/persons", async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const person = await Person.findById(id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

app.patch("/api/persons/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { name: body.name, number: body.number },
      { new: true, runValidators: true, context: "query" }
    );
    res.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    await Person.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get("/info", async (req, res) => {
  const peopleCount = (await Person.find({})).length;
  res.send(
    `<p>Phonebook has info for ${peopleCount} people ${new Date(
      Date.now()
    ).toString()}</p>`
  );
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

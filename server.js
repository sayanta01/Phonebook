import express from "express";
import Person from "./models/person.js";
import cors from "cors";
// import morgan from "morgan";
const app = express();

app.use(express.static("dist"));
app.use(cors());
// json-parser is listed before requestLogger, or request.body will be undefined when the logger runs
app.use(express.json());
// morgan.token("host-body", function (req, res) {
//   return `Host: ${req.hostname}, Body: ${JSON.stringify(req.body)}`;
// });
// app.use(
//   morgan(
//     `🚪:method :url 💬:status 📏:res[content-length] ⏳:response-time ms 🌍:host-body`,
//   ),
// );

// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
// ];

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   next();
// };
// app.use(requestLogger);

// app.get("/info", (req, res) => {
//   res.status(200).send(`
//     <h1>Phonebook has info for ${Person.length} people</h1>
//     <h3>${new Date().toString()}</h3>
// `);
// });

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
    // res.send("<h1>Hello World!</h1>");
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });

  // ---------------------------------------------------------------------------

  // const id = req.params.id;
  // const person = persons.find((person) => person.id === id);
  //
  // if (person) {
  //   res.json(person);
  // } else {
  //   res.status(404).json("4O4"); // ends the response with no body
  // }
});

// const generateId = () => {
//   const maxId =
//     persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0;
//
//   return String(maxId + 1);
// };

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  // if body.name & number is falsy
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  // const nameExists = Person.some((person) => person.name === body.name);
  // if (nameExists) {
  //   return res.status(400).json({ error: "name must be unique" });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generateId(),
  });

  // Save the contact to the database and return a Promise
  person
    .save()
    .then((savedContact) => {
      // Send the saved contact back to the client as JSON when done
      response.json(savedContact); // automatically converts to JSON with JSON.stringify(savedPerson) under the hood
    })
    .catch((error) => {
      response.status(400).json({ error: error.message });
    });

  // ---------------------------------------------------------------------------

  // const nameExists = Person.some((person) => person.name === body.name);
  // if (nameExists) {
  //   return res.status(400).json({ error: "name must be unique" });
  // }
  //
  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: generateId(),
  // };
  //
  // persons = persons.concat(person);
  // res.json(person);
});

app.put("/api/persons/:id", (request, response) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => {
      response.status(400).json({ error: error.message });
    });

  // ---------------------------------------------------------------------------

  // const id = req.params.id;
  // const person = persons.find((person) => person.id === id);
  // if (!person) {
  //   return res.status(404).json({ error: "Person not found" });
  // }
  //
  // const { name, number } = req.body;
  // if (!name || !number) {
  //   return res.status(400).json({ error: "Name and number are required" });
  // }
  //
  // person.name = name;
  // person.number = number;
  // res.json(person);
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end(); // 204 No Content (successful deletion)
    })
    .catch((error) => next(error));
  // .catch((error) => {
  //   response.status(400).json({ error: error.message });
  // });

  // const id = req.params.id;
  // persons = persons.filter((person) => person.id !== id);
  // res.status(204).end("4O4");
});

// ERROR-HANDLING MIDDLEWARE (must be after all routes)
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

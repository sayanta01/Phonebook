import express from "express";
import cors from "cors";
// import morgan from "morgan";
const app = express();

app.use(express.static("dist"));
app.use(cors());
// morgan.token("host-body", function (req, res) {
//   return `Host: ${req.hostname}, Body: ${JSON.stringify(req.body)}`;
// });
// app.use(
//   morgan(
//     `🚪:method :url 💬:status 📏:res[content-length] ⏳:response-time ms 🌍:host-body`,
//   ),
// );

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
];

// json-parser is listed before requestLogger, because otherwise request.body will not be initialized when the logger is executed!
app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  next();
};
app.use(requestLogger);

app.get("/info", (req, res) => {
  res.status(200).send(`
    <h1>Phonebook has info for ${persons.length} people</h1>
    <h3>${new Date().toString()}</h3>
`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).json("4O4"); // ends the response with no body
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end("4O4");
});

app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }

  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
  }

  person.name = name;
  person.number = number;
  res.json(person);
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0;

  return String(maxId + 1);
};

app.post("/api/persons/", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const nameExists = persons.some((person) => person.name === body.name);
  if (nameExists) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

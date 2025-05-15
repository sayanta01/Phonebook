import mongoose from "mongoose";

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

const password = process.argv[2];
const url = `mongodb+srv://sayanta:${password}@cluster0.kkvr7dj.mongodb.net/phonebook_app?retryWrites=true&w=majority&appName=Cluster0`;

// Strictly enforce queries, only fields defined in the schema are allowed in queries
mongoose.set("strictQuery", false);
mongoose.connect(url);

// After establishing the connection to the database, we define the schema for a person and the matching model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 5) {
  // Fetching objects from the database
  // The parameter of the method is an object expressing search conditions
  Person.find({}).then((result) => {
    console.log(result);
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  // Create a new person object with the help of the Person model:
  const person = new Person({
    name,
    number: number,
  });

  // Saving the object to the database, which can be provided with an event handler
  person.save().then((result) => {
    console.log(`Added ${person.name} ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}

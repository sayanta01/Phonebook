import { useState, useEffect } from "react";
import axios from "axios";
import PersonForm from "./components/PersonForm";
import Notification from "./components/Notification";
import personService from "./services/persons";

function Phonebook() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState(""); // newName state is for controlling the form input element 💡
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState({
    text: null,
    type: null,
  });

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons); // fetch persons from the server and update the state
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    // if (newName.trim() === "" || newNumber.trim() === "") {
    //   alert("Empty field");
    //   return;
    // }

    // const nameExists = persons.some((person) => person.name === newName);
    // if (nameExists) {
    //   alert(`${newName} is already added to phonebook`);
    //   return; // stop execution if name exists
    // }

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = confirm(`Update number of ${newName}?`);

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService // 💡
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons((prev) =>
              prev.map((person) =>
                // returns true if the value or type is different, otherwise false
                person.id !== existingPerson.id ? person : returnedPerson,
              ),
            );
            setNewName("");
            setNewNumber("");
          })
          .catch(() => {
            setMessage({
              text: `Information of '${updatedPerson.name}' has already been removed from server`,
              type: "error",
            });
            setTimeout(() => setMessage(null), 4000);
            // keep only the persons whose id is not equal to updatedPerson.id
            setPersons(persons.filter((p) => p.id !== updatedPerson.id));
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    personService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons([...persons, returnedPerson]);
        setMessage({ text: `Added ${newPerson.name}`, type: "success" });
        setTimeout(() => {
          setMessage(null);
        }, 2000);
        setNewName(""); // clears the input field after submitting the form
        setNewNumber("");
      })
      .catch((error) => {
        // this is the way to access the error message
        console.log(error.response.data.error);
      });
  };

  // const handleNameChange = (event) => setNewName(event.target.value);
  // const handleNumberChange = (e) => setNewNumber(e.target.value);

  // axios.delete(`http://localhost:3001/persons/${id}`).then(() => {
  //   setPersons(persons.filter((person) => person.id !== id));
  // });
  const handleDelete = (id) => {
    const personToDel = persons.find((p) => p.id === id);
    const confirmDel = confirm(`Delete ${personToDel.name} contact`);

    // if confirmDel is false
    if (!confirmDel) {
      console.log("Cancelled");
      return;
    }

    personService.del(id).then(() => {
      setPersons(persons.filter((person) => person.id !== id));
    });
  };

  return (
    <>
      <h1>Phonebook</h1>
      <Notification message={message} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.name} : {person.number}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Phonebook;

const PersonForm = ({
  addPerson,
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
}) => (
  <form onSubmit={addPerson}>
    <div>
      Name: <input value={newName} onChange={handleNameChange} />{" "}
    </div>

    <div>
      {/* pattern="[0-4]*" */}
      Number:
      <input
        type="tel"
        value={newNumber}
        onChange={handleNumberChange}
      />
    </div>

    <div>
      <button type="submit">Add</button>
    </div>
  </form>
);

export default PersonForm;

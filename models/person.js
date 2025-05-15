// Mongoose-specific code into its own module
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

// Strictly enforce queries, only fields defined in the schema are allowed in queries
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// After establishing the connection to the database, we define the schema for a person and the matching model
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
  },
  number: {
    type: String,
    minLength: 8,
    // validate: {
    //   validator: function (v) {
    //     return /\d{3}-\d{3}-\d{4}/.test(v);
    //   },
    //   message: (props) => `${props.value} is not a valid phone number!`,
    // },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model("Person", personSchema);
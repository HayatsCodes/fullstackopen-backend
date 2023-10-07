const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    'Enter a password as the third argument e.g "node mongo.js <password>"'
  );
  process.exit(1);
}

const password = process.argv[2];

const uri = `mongodb+srv://hayatscodes:${password}@cluster0.7ivqns6.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });
    
    const Person = mongoose.model("Person", personSchema);
    
    if (process.argv.length === 3) {
        console.log('Phonebook:');
      Person.find({}).then((people) => {
        people.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        }
        );
        mongoose.connection.close();
      });
    } else if (process.argv.length === 4) {
        console.log('Enter name and number of person');
        process.exit(1);
    } else if (process.argv.length === 5) {
        const name = process.argv[3]
        const number = process.argv[4]

        const person = new Person ({
            name,
            number
        })

        person.save().then(() => {
            console.log(`added ${name} number ${number} to phonebook`);
            mongoose.connection.close();
        })
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

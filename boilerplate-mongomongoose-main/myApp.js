require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// writing schema or structure of the document/row for the collection/table
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  // create an instance of model
  let doc = new Person({name: "soham", age: 22, favoriteFoods: ["vadapav"]});
  // then save it and callback done
  doc.save().then((doc)=>{console.log(doc); done(null, doc)}).catch((err)=>{console.log(err); done(err);});
};

const createManyPeople = (arrayOfPeople, done) => {
  // console.log(arrayOfPeople);
  // model.create is used to populate/seed the database
  // it takes array of objects and saves them into the database 
  Person.create(arrayOfPeople).then((doc)=>{done(null, doc);}).catch((err)=>{done(err);});
  console.log(arrayOfPeople);
};

const findPeopleByName = (personName, done) => {
  //model.find() takes object as query input and returns array of matching items
  Person.find({name: personName}).then((doc)=>{done(null, doc)}).catch((err)=>{done(err)});
};

const findOneByFood = (food, done) => {
  // model.findOne() works same as .find() but returns only one document instead of an array
  Person.findOne({favoriteFoods: food}).then((doc)=>{console.log(doc); done(null, doc);}).catch((err)=>{done(err);});
};

const findPersonById = (personId, done) => {
  // finds by id 
  Person.findById(personId, function(err, doc){
    if(err){
      done(err);
    }
    // console.log(doc);
    done(null, doc);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  // find the person by id and get hold of it in callback
  Person.findById(personId, function(err, doc){
    if(err){done(err);}
    // get hold of favoritefoods to edit and update
    let foods = doc.favoriteFoods;
    // console.log(doc);
    foods.push(foodToAdd);
    doc.favoriteFoods = foods;
    // console.log(doc);
    // save the doc
    doc.save().then((doc)=>{done(null, doc);}).catch((err)=>{done(err);});

  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  // args: {query}, {fields to update}, callback 
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, function(err, doc){
    if(err){done(err);}
    // console.log(doc);
    done(null, doc);
  });

};

const removeById = (personId, done) => {
  // args: {query to remove}, callback
  Person.findByIdAndRemove({_id: personId}, function(err, doc){
    if(err){done(err);}
    // console.log(doc); // returns the deleted document
    done(null, doc);
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, doc)=>{
    if(err){done(err);}
    // console.log(doc); // returns a json object with info of rows affected
    done(null, doc);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  // sort(args: fields to sort by).limit(args: limit of documents).select(args: fields to display)
  Person.find({favoriteFoods: foodToSearch}).sort("name").limit(2).select(["name", "favoriteFoods"]).exec((err,doc)=>{
    if(err){done(err);}
    // console.log(doc);
    done(null, doc);
  })

};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;

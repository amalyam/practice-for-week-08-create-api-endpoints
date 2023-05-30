const express = require("express");
const http = require("http");

const app = express();
app.use(express.json());

const dogs = [
  {
    dogId: 1,
    name: "Fluffy",
    age: 2,
  },
];

let nextDogId = 2;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

function findDogById(dogId) {
  return dogs.find((dog) => `${dog.dogId}` === dogId);
}

// Phase 1
app.get("/dogs", (req, res) => {
  return res.status(200).send(dogs);
});

// Phase 2
app.get("/dogs/:dogId", (req, res) => {
  const { dogId } = req.params;

  const requestedDog = findDogById(dogId);

  if (requestedDog) {
    return res.status(200).send(requestedDog);
  } else {
    return res.status(400).send({ message: "Dog not found" });
  }
});

// Phase 3

app.post("/dogs", (req, res) => {
  const { name, age } = req.body;

  const newDog = {
    dogId: getNewDogId(),
    name,
    age,
  };

  dogs.push(newDog);

  return res.status(201).send(newDog);
});

function updateDogByIdRoute(req, res) {
  const { name, age } = req.body;
  let editDog = findDogById(req.params.dogId);

  editDog.name = name;
  editDog.age = age;

  return res.status(200).send(editDog);
}
// Phase 4
app.put("/dogs/:dogId", updateDogByIdRoute);
app.patch("/dogs/:dogId", updateDogByIdRoute);

// Phase 5
app.delete("/dogs/:dogId", (req, res) => {
  const deleteIndex = findDogById(req.params.dogId).dogId;

  if (deleteIndex > -1) {
    dogs.splice(deleteIndex, 1);
    return res.status(200).send({ message: "Successfully deleted" });
  } else {
    return res.status(400).send({ message: "Dog not found" });
  }
});

if (require.main === module) {
  const port = 8000;
  app.listen(port, () => console.log(`Server is listening on port ${port}`));
} else {
  module.exports = http.createServer(app);
}

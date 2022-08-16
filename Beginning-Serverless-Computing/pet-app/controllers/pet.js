const express = require('express');
const router = express.Router();

let pets = [
    {id: 1, name: 'Catty'}, 
    {id: 2, name: 'Dogone'}
];

router.get('/', async (req, res, next) => {
  return res.json(pets);
});

router.get('/:petId', async (req, res, next) => {
  const petId = req.params.petId;
  const pet = pets.find(pt => pt.id == petId);
  if (pet) {
    return res.json(pet);
  }
  return res.status(404).json({message: `pet with id ${petId} was not found`});
});


router.post('/create', async (req, res, next) => {
  const pet = req.body;
  pet.id = pets.length + 1;
  pets.push(pet);
  return res.status(201).json(pets[pets.length-1]);
});

router.put('/:petId', async (req, res, next) => {
  const petId = req.params.petId;
  const index = pets.findIndex(pt => pt.id == petId);
  if (index == -1) {
    return res.status(400).json({ message: 'The '});
  } 
  const data = req.body;
  delete data.id;
  pets[index] = data;
  return res.status(201).json(pets[index]);
});

router.delete('/:petId', async (req, res, next) => {
  const petId = req.params.petId;
  pets = pets.filter(pt => pt.id != petId);
  return res.status(204).json({});
});

module.exports = router;
const express = require('express');
const Pet = require('../models/Pet');
const multer = require('multer');
const router = express.Router();

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new pet with an image
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        console.error("req.body");
        console.error(req.body);
        console.error("req.body");
        const { name, age, type, description } = req.body;
        const image = req.file.buffer.toString('base64'); // Convert image buffer to base64

        const newPet = new Pet({
            name,
            age,
            type,
            image,
            description
        });
        console.error(newPet);
        await newPet.save();
        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({ error: 'Unable to Create a Pet',error });
    }
});

// Get pets by category
router.get('/', async (req, res) => {
    const { category } = req.query;
    console.error(category);
    try {
      const pets = await Pet.find({ type: category }); // Assuming 'type' field in Pet model
      res.json(pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
      res.status(500).json({ error: 'Error fetching pets' });
    }
  });

// Get All Pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).send('Error fetching pets');
  }
});

// Get Pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).send('Pet not found');
    res.json(pet);
  } catch (error) {
    res.status(500).send('Error fetching pet');
  }
});

// Update Pet
router.put('/:id', async (req, res) => {
  const { name, age, type, description,image } = req.body;
  console.log(req.body);
  console.log({ name, age, type, description, image });
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, { name, age, type, description, image }, { new: true });
    if (!pet) return res.status(404).send('Pet not found');
    res.json(pet);
  } catch (error) {
    res.status(500).send('Error updating pet');
  }
});

// Delete Pet
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).send('Pet not found');
    res.send('Pet deleted');
  } catch (error) {
    res.status(500).send('Error deleting pet');
  }
});

module.exports = router;

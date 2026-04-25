
const express = require('express');
const router = express.Router();
const { Category } = require('../models');

// ---------------------
// Ajouter une Catégorie
// ---------------------
router.post('/', async (req, res) => {
  try {
    const { name, image_url } = req.body;

    const category = await Category.create({
      name,
      image_url,
    });

    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Liste de toutes les Catégories
// ---------------------
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Obtenir une Catégorie par ID
// ---------------------
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Catégorie non trouvé' });

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Modifier une Catégorie
// ---------------------
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const { name, image_url } = req.body;

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Catégorie non trouvé' });

    await category.update({
      name,
      image_url,
    });

    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Supprimer une Catégorie
// ---------------------
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Catégorie non trouvé' });

    await category.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

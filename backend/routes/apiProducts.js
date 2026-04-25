const express = require('express');
const router = express.Router();
const { Product, Category } = require('../models');

// ---------------------
// Ajouter un Produit
// ---------------------
router.post('/', async (req, res) => {
  try {
    const { name, price, description, image_url, category_id } = req.body;

    const product = await Product.create({
      name,
      price,
      description,
      image_url,
      category_id,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Liste de tous les Produits
// ---------------------
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Obtenir un Produit par ID
// ---------------------
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const product = await Product.findByPk(id, {
      include: [Category]
    });

    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Modifier un Produit
// ---------------------
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const { name, price, description, image_url, category_id } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    await product.update({
      name,
      price,
      description,
      image_url,
      category_id,
    });

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Supprimer un Produit
// ---------------------
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    await product.destroy();
    res.status(204).send(); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

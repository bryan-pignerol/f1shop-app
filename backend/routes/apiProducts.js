const express = require('express');
const router = express.Router();
const { Product, Category } = require('../models');

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

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category]
    });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, price, description, category_id, image_url } = req.body;
    const newProduct = await Product.create({ 
      name, 
      price, 
      description, 
      category_id, 
      image_url 
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, price, description, category_id, image_url } = req.body;
    const product = await Product.findByPk(req.params.id);
    
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    await product.update({ 
      name, 
      price, 
      description, 
      category_id, 
      image_url 
    });
    
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    await product.destroy();
    res.status(200).json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

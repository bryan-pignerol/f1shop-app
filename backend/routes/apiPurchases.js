const express = require('express');
const router = express.Router();
const { Purchase, Product } = require('../models');

// ---------------------
// Ajouter un Achat
// ---------------------
router.post('/', async (req, res) => {
  try {
    const { product_id, quantity, purchase_price, date } = req.body;

    const purchase = await Purchase.create({
      product_id,
      quantity,
      purchase_price,
      date: new Date(date),
    });

    res.status(201).json(purchase);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Liste de tous les Achats
// ---------------------
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price'] 
      }]
    });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Obtenir un Achat par ID
// ---------------------
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const purchase = await Purchase.findByPk(id, {
      include: [Product]
    });

    if (!purchase) return res.status(404).json({ message: 'Achat non trouvé' });

    res.json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Modifier un Achat
// ---------------------
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const { product_id, quantity, purchase_price, date } = req.body;

    const purchase = await Purchase.findByPk(id);
    if (!purchase) return res.status(404).json({ message: 'Achat non trouvé' });

    await purchase.update({
      product_id,
      quantity,
      purchase_price,
      date: new Date(date),
    });

    res.json(purchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Supprimer un Achat
// ---------------------
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const purchase = await Purchase.findByPk(id);
    if (!purchase) return res.status(404).json({ message: 'Achat non trouvé' });

    await purchase.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
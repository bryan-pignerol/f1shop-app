const express = require('express');
const router = express.Router();
const { OrderProduct, Product, Order } = require('../models');

// -----------------------------------------
// Ajouter un produit à une commande
// -----------------------------------------
router.post('/', async (req, res) => {
  try {
    const { order_id, product_id, quantity } = req.body;

    const entry = await OrderProduct.create({
      order_id,
      product_id,
      quantity
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// -----------------------------------------
// Liste de toutes les liaisons
// -----------------------------------------
router.get('/', async (req, res) => {
  try {
    const items = await OrderProduct.findAll({
      include: [Product, Order]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------
// Modifier la quantité d'un produit dans une commande
// -----------------------------------------
router.put('/order/:order_id/product/:product_id', async (req, res) => {
  try {
    const { order_id, product_id } = req.params;
    const { quantity } = req.body;

    const item = await OrderProduct.findOne({
      where: { order_id, product_id }
    });

    if (!item) return res.status(404).json({ message: 'Liaison non trouvée' });

    await item.update({ quantity });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// -----------------------------------------
// Retirer un produit d'une commande
// -----------------------------------------
router.delete('/order/:order_id/product/:product_id', async (req, res) => {
  try {
    const { order_id, product_id } = req.params;

    const item = await OrderProduct.findOne({
      where: { order_id, product_id }
    });

    if (!item) return res.status(404).json({ message: 'Liaison non trouvée' });

    await item.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Order, Client } = require('../models');

// ---------------------
// Ajouter une Commande
// ---------------------
router.post('/', async (req, res) => {
  try {
    const { client_id, date, total } = req.body;

    const order = await Order.create({
      client_id,
      date: new Date(date),
      total,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Liste de toutes les Commandes
// ---------------------
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: Client,
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Obtenir une Commande par ID
// ---------------------
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const order = await Order.findByPk(id, {
      include: [Client]
    });

    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Modifier une Commande
// ---------------------
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const { client_id, date, total } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

    await order.update({
      client_id,
      date: new Date(date),
      total,
    });

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Supprimer une Commande
// ---------------------
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

    await order.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

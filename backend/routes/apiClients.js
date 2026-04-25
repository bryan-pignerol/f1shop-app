
const express = require('express');
const router = express.Router();
const { Client } = require('../models');

// ---------------------
// Ajouter un Client
// ---------------------
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const client = await Client.create({
      name,
      email,
      phone,
    });

    res.status(201).json(client);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Liste de tous les Clients
// ---------------------
router.get('/', async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Obtenir un Client par ID
// ---------------------
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });

    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Modifier un Client
// ---------------------
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const { name, email, phone } = req.body;

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });

    await client.update({
      name,
      email,
      phone,
    });

    res.json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Supprimer un Client
// ---------------------
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });

    await client.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

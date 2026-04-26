const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const sequelize = require('./config/db'); //  Import de Sequelize depuis config/db.js


// Import des routes API et EJS
const apiCategoriesRouter = require('./routes/apiCategories');
const apiClientsRouter = require('./routes/apiClients');
const apiOrderProductsRouter = require('./routes/apiOrderProducts');
const apiOrdersRouter = require('./routes/apiOrders');
const apiProductsRouter = require('./routes/apiProducts');
const apiPurchasesRouter = require('./routes/apiPurchases');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


const app = express();

//  Autoriser les requêtes cross-origin
app.use(cors());

//  Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//  Configuration du moteur de vues EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  Dossier public + Bootstrap
app.use(express.static('public'));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

//  Routes EJS
app.use('/', indexRouter);
app.use('/users', usersRouter);


//  Routes API
app.use('/api/categories', apiCategoriesRouter)
app.use('/api/clients', apiClientsRouter)
app.use('/api/order_products', apiOrderProductsRouter)
app.use('/api/orders', apiOrdersRouter)
app.use('/api/products', apiProductsRouter)
app.use('/api/purchases', apiPurchasesRouter)


//  Page d'accueil
app.get('/', (req, res) => {
  res.render('index');
});

//  Gestion des erreurs 404
app.use((req, res, next) => {
  if (req.accepts('json')) {
    res.status(404).json({ message: 'Route non trouvée' });
  } else {
    res.status(404).render('404');
  }
});

//  Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err);
  if (req.accepts('json')) {
    res.status(err.status || 500).json({ message: err.message || 'Erreur interne du serveur' });
  } else {
    res.status(err.status || 500).render('error', { error: err });
  }
});

//  Lancer le serveur aprÃ¨s la connexion Ã  MySQL
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log(' Connecté à la base MySQL "university" via Sequelize');

    // Si tu veux créer automatiquement les tables (optionnel)
    // await sequelize.sync({ alter: false });

    app.listen(PORT, () => {
      console.log(` Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Erreur de connexion MySQL :', error);
  }
})();

module.exports = app;

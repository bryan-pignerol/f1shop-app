-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 27 avr. 2026 à 11:23
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `f1shop`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `image_url`) VALUES
(7, 'Saison 2025', 'https://upload.wikimedia.org/wikipedia/commons/f/f6/2025_Japan_GP_-_McLaren_-_Oscar_Piastri_-_FP1.jpg'),
(8, 'Historique', 'https://motorsport.nextgen-auto.com/IMG/logo/arton171116.jpg'),
(9, 'Saison 2023', 'https://upload.wikimedia.org/wikipedia/commons/7/79/FIA_F1_Austria_2023_Nr._1_%281%29.jpg'),
(10, 'Saison 2021', 'https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/content/dam/fom-website/manual/Misc/2021preseason/GettyImages-1231662192.webp');

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `clients`
--

INSERT INTO `clients` (`id`, `name`, `email`, `phone`) VALUES
(1, 'Max Verstappen', 'max@verstappen.com', '+31 20 123 4567'),
(2, 'Adrian Newey', 'adriannewey@gmail.com', '+33612345678'),
(3, 'Bryan PIGNEROL', 'br.pignerol@gmail.com', '+33679446692');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `total` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `client_id`, `date`, `total`) VALUES
(6, 1, '2026-04-26', 17500000.00),
(7, 3, '2026-04-26', 20000000.00),
(8, 2, '2026-04-27', 4500000.00),
(9, 3, '2026-04-27', 2250000.00);

-- --------------------------------------------------------

--
-- Structure de la table `order_products`
--

CREATE TABLE `order_products` (
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `order_products`
--

INSERT INTO `order_products` (`order_id`, `product_id`, `quantity`) VALUES
(6, 1, 1),
(6, 2, 1),
(7, 1, 1),
(7, 2, 1),
(7, 3, 1),
(8, 2, 1),
(8, 3, 1),
(9, 5, 1);

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `image_url`, `category_id`) VALUES
(1, 'Ferrari SF-25', 15500000.00, 'Le cauchemar des Tifosis.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlywyRt3yrcgrsml63ajjc4A8p9VJP8DKD6g&s', 7),
(2, 'Red Bull RB 2019', 2000000.00, 'Formule 1 mythique de chez Red Bull dans laquelle Max Verstappen a réussi à remporter 19 des 22 courses de 2023.', 'https://upload.wikimedia.org/wikipedia/commons/7/79/FIA_F1_Austria_2023_Nr._1_%281%29.jpg', 9),
(3, 'Red Bull RB16B', 2500000.00, 'Formule 1 avec laquelle Verstappen a gagné son premier titre.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdAmvad0Cy4UKurAWWzuQkV_fQBwYsa5FSVaNomPCCOw&s=10', 10),
(4, 'Mercedes-AMG F1 W12 E Performance', 2100000.00, 'La Formule 1 de chez Mercedes qui a remporté le titre constructeur en 2021.', 'https://upload.wikimedia.org/wikipedia/commons/2/27/FIA_F1_Austria_2021_Nr._44_Hamilton_%28side%29.jpg', 10),
(5, 'McLaren MCL39', 2250000.00, 'La monoplace qui a fait remporter le championnat constructeur à McLaren et son premier titre de champion du monde à Lando Norris.', 'https://images.ctfassets.net/gy95mqeyjg28/7y3Mg3FyDT6YG4ciDBdbKP/6178c8e5dee34aada15e6d824dbc82a6/RaceReport_0004_2236553544.jpg', 7);

-- --------------------------------------------------------

--
-- Structure de la table `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `purchase_price` decimal(12,2) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `purchases`
--

INSERT INTO `purchases` (`id`, `product_id`, `quantity`, `purchase_price`, `date`) VALUES
(1, 2, 2, 1800000.00, '2026-04-26'),
(2, 3, 5, 2350000.00, '2026-04-26');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Index pour la table `order_products`
--
ALTER TABLE `order_products`
  ADD PRIMARY KEY (`order_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Index pour la table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `order_products`
--
ALTER TABLE `order_products`
  ADD CONSTRAINT `order_products_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

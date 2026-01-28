-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 28-01-2026 a las 21:42:02
-- Versión del servidor: 8.0.43
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `the_good_code`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campaña`
--

CREATE TABLE `campaña` (
  `id_campana` int NOT NULL,
  `nombre_campana` varchar(100) NOT NULL,
  `objetivo_litros_campana` decimal(5,2) NOT NULL,
  `fecha_inicio_campana` date NOT NULL,
  `fecha_fin_campana` date NOT NULL,
  `urgente_campana` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `campaña`
--

INSERT INTO `campaña` (`id_campana`, `nombre_campana`, `objetivo_litros_campana`, `fecha_inicio_campana`, `fecha_fin_campana`, `urgente_campana`) VALUES
(1, 'Maratón Universitario', 100.00, '2024-03-01', '2024-03-05', 0),
(2, 'Emergencia Verano', 250.50, '2024-07-17', '2024-08-31', 1),
(3, 'Colecta Hospital Central', 500.00, '2024-01-10', '2024-12-20', 0),
(4, 'Operación Salida Segura', 120.00, '2024-04-01', '2024-04-15', 1),
(5, 'Donación en Empresas Tech', 80.00, '2024-09-10', '2024-09-12', 0),
(6, 'Bus Solidario Ruta Norte', 60.50, '2024-05-01', '2024-05-30', 0),
(7, 'Campaña Navideña', 150.00, '2024-12-01', '2024-12-24', 1),
(8, 'Jornadas Salud Joven', 75.00, '2024-10-15', '2024-10-20', 0),
(9, 'Semana de la Salud', 200.00, '2024-05-10', '2024-05-17', 0),
(10, 'Alerta Reservas Bajas', 400.00, '2024-08-01', '2024-08-15', 1),
(11, 'Donación Universitaria II', 150.00, '2024-10-01', '2024-10-05', 0),
(12, 'Campaña de Otoño', 180.50, '2024-11-01', '2024-11-30', 0),
(13, 'Operación Kilo de Sangre', 90.00, '2024-02-14', '2024-02-14', 1),
(14, 'Fiestas Patronales', 120.00, '2024-08-15', '2024-08-20', 0),
(15, 'Emergencia Sísmica', 500.00, '2024-01-05', '2024-02-28', 1),
(16, 'Ruta Solidaria Sur', 75.25, '2024-04-20', '2024-04-25', 0),
(17, 'Campaña Escolar Padres', 110.00, '2024-09-15', '2024-09-30', 0),
(18, 'Invierno Cálido', 220.00, '2024-01-15', '2024-03-01', 0),
(19, 'Urgencia Nacional', 600.00, '2024-12-26', '2024-12-31', 1),
(20, 'BORRARBORRARrr', 55.00, '2026-02-04', '2026-02-04', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `donacion`
--

CREATE TABLE `donacion` (
  `id_donacion` int NOT NULL,
  `id_campana` int NOT NULL,
  `nombre_donante` varchar(100) NOT NULL,
  `peso_donante` decimal(5,2) NOT NULL,
  `fecha_donacion` date NOT NULL,
  `es_primera_vez` tinyint(1) NOT NULL DEFAULT '0',
  `grupo_sanguineo` varchar(5) NOT NULL,
  `URL_image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `donacion`
--

INSERT INTO `donacion` (`id_donacion`, `id_campana`, `nombre_donante`, `peso_donante`, `fecha_donacion`, `es_primera_vez`, `grupo_sanguineo`, `URL_image`) VALUES
(1, 1, 'Juan Pérez', 75.50, '2024-03-02', 1, 'A-', 'https://upload.wikimedia.org/wikipedia/commons/0/01/Juan_P%C3%A9rez_Monge_y_Rub%C3%A9n_Ayala.png'),
(2, 1, 'Ana García', 62.00, '2024-03-02', 0, '0-', 'https://upload.wikimedia.org/wikipedia/commons/6/68/Ana_Garc%C3%ADa_Car%C3%ADas_%28Visita_de_Estado_a_Ecuador_-_2017%29.jpg'),
(3, 1, 'Carlos Ruiz', 80.00, '2024-03-03', 0, 'B+', 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Carlos_Ruiz.JPG'),
(4, 2, 'María López', 55.50, '2024-07-10', 1, 'AB+', 'https://upload.wikimedia.org/wikipedia/commons/7/78/Malaga_Film_Festival_2025_-_Mar%C3%ADa_Isabel_L%C3%B3pez_%28cropped%29.jpg'),
(5, 2, 'Lucía Fernández', 68.00, '2024-07-15', 0, 'A-', 'https://upload.wikimedia.org/wikipedia/commons/0/00/Mar%C3%ADa_Luc%C3%ADa_Fern%C3%A1ndez.jpg'),
(6, 2, 'Jorge Yáñez', 90.20, '2024-07-20', 0, '0+', 'https://upload.wikimedia.org/wikipedia/commons/4/42/Jorge_Y%C3%A1%C3%B1ez_%2824507759017%29_%28cropped%29.jpg'),
(7, 3, 'Raúl González', 78.00, '2024-02-15', 0, 'B-', 'https://upload.wikimedia.org/wikipedia/commons/5/5a/25th_Laureus_World_Sports_Awards_-_Ra%C3%BAl_-_240422_132916-2_%28cropped%29.jpg'),
(8, 3, 'Elena Nito', 60.00, '2024-03-20', 1, 'A+', 'https://upload.wikimedia.org/wikipedia/commons/4/49/Mim%C3%AD_Pons_1971.jpg'),
(9, 4, 'Pedro Pascal', 85.00, '2024-04-02', 0, '0-', 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Pedro_Pascal_at_the_2025_Cannes_Film_Festival_06_%28cropped%29.jpg'),
(10, 4, 'Sara Connor', 64.50, '2024-04-05', 1, 'AB-', 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Fan_Expo_2013_-_Linda_Hamilton_%289669548948%29.jpg'),
(11, 5, 'Elon M.', 88.00, '2024-09-10', 0, 'A+', 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg'),
(12, 1, 'Laura borrar', 65.50, '2024-03-02', 1, '0-', 'https://upload.wikimedia.org/wikipedia/commons/4/49/Laura_Bozzo_2014.png'),
(13, 6, 'Marta Sánchez', 58.00, '2024-05-02', 1, '0+', 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Marta_Sanchez_during_the_promotion_of_her_last_album_in_April_2007.jpg'),
(14, 6, 'David Bisbal', 72.50, '2024-05-03', 0, 'A-', 'https://upload.wikimedia.org/wikipedia/commons/5/58/2023-11-16_Gala_de_los_Latin_Grammy%2C_12_%28cropped%29.jpg'),
(15, 7, 'Papá Noel', 120.00, '2024-12-23', 0, '0-', 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Merry_Old_Santa_Claus_by_Thomas_Nast.jpg'),
(16, 7, 'El Grinch', 50.00, '2024-12-20', 1, 'B-', 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Grinch_sand_sculpture.jpg'),
(17, 8, 'Laura Pausini', 61.00, '2024-10-16', 0, 'A+', 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Laura_Pausini_2009.04.30_018.jpg'),
(18, 8, 'Alejandro Sanz', 80.00, '2024-10-18', 0, 'AB+', 'https://upload.wikimedia.org/wikipedia/commons/2/21/Goyas_2025_-_Alejandro_Sanz_%28cropped%29.jpg'),
(19, 9, 'Roberto Álamo', 85.00, '2024-05-11', 1, 'A+', 'https://upload.wikimedia.org/wikipedia/commons/8/83/Roberto_%C3%81lamo_-_Seminci_2011.jpg'),
(20, 9, 'Sonia Bermúdez', 62.40, '2024-05-12', 0, '0-', 'https://upload.wikimedia.org/wikipedia/commons/5/55/Sonia_Berm%C3%BAdez.JPG'),
(21, 9, 'Iker Casillas', 90.00, '2024-05-12', 0, 'B+', 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Iker_Casillas_2.jpg'),
(22, 10, 'Penélope Cruz', 54.00, '2024-08-02', 1, 'AB+', 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Goyas_2024_-_Pen%C3%A9lope_Cruz-2_%28cropped%29.jpg'),
(23, 10, 'Antonio Banderas', 78.50, '2024-08-03', 0, 'A-', 'https://upload.wikimedia.org/wikipedia/commons/7/72/Goyas_2025_-_Antonio_Banderas_%28cropped%29.jpg'),
(24, 10, 'Javier Bardem', 95.00, '2024-08-05', 0, '0+', 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Premios_Goya_2018_-_Javier_Bardem_%28cropped%29.jpg'),
(25, 10, 'Elsa Pataky', 59.00, '2024-08-10', 1, 'B-', 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Elsa_Pataky_Cutout.png'),
(26, 11, 'Rafa Nadal', 86.00, '2024-10-02', 0, 'A+', 'https://upload.wikimedia.org/wikipedia/commons/d/da/Rafael_Nadal_Laureus_2024_%28cropped%29.jpg'),
(27, 11, 'Fernando Alonso', 72.00, '2024-10-03', 0, '0+', 'https://upload.wikimedia.org/wikipedia/commons/3/33/Fernando_Alonso_racing_at_the_2024_F1_in_Schools_World_Finals_%28cropped%29.jpg'),
(28, 12, 'Rosalía Vila', 60.50, '2024-11-05', 1, 'A-', 'https://upload.wikimedia.org/wikipedia/commons/f/f1/2023-11-16_Gala_de_los_Latin_Grammy%2C_27_%28cropped%2902.jpg'),
(29, 12, 'C. Tangana', 75.00, '2024-11-15', 0, 'B+', 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Goyas_2025_-_C_Tangana_%28cropped%29.jpg'),
(30, 12, 'Aitana Ocaña', 56.00, '2024-11-20', 1, 'AB-', 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Aitana_Lecturas_2025.1.jpg'),
(31, 13, 'Pablo Alborán', 80.00, '2024-02-14', 0, '0-', 'https://upload.wikimedia.org/wikipedia/commons/f/f4/2023-11-16_Gala_de_los_Latin_Grammy%2C_23_%28cropped%29.jpg'),
(32, 13, 'Vanesa Martín', 63.00, '2024-02-14', 0, 'A+', 'https://upload.wikimedia.org/wikipedia/commons/a/a1/2023-11-16_Gala_de_los_Latin_Grammy%2C_26_%28cropped%29.jpg'),
(33, 14, 'Ibai Llanos', 110.00, '2024-08-16', 1, 'B+', 'https://upload.wikimedia.org/wikipedia/commons/5/5e/As%C3%AD_fue_la_Presentaci%C3%B3n_de_la_Velada_del_A%C3%B1o_5_24.jpg'),
(34, 14, 'El Rubius', 65.00, '2024-08-17', 0, 'AB+', 'https://upload.wikimedia.org/wikipedia/commons/d/df/El_Rubius_en_el_Festival_de_cinema_de_Sitges_2018_%28recorte%29.jpg'),
(35, 15, 'Pedro Pascal', 88.50, '2024-01-10', 0, 'B-', 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Pedro_Pascal_at_the_2025_Cannes_Film_Festival_06_%28cropped%29.jpg'),
(36, 15, 'Úrsula Corberó', 53.00, '2024-01-20', 1, '0+', 'https://upload.wikimedia.org/wikipedia/commons/e/e5/%C3%9Arsula_Corber%C3%B3-65339.jpg'),
(37, 15, 'Miguel Herrán', 70.00, '2024-02-05', 0, 'A+', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Festival_de_M%C3%A1laga_2020_-_Miguel_Herr%C3%A1n-2.jpg'),
(38, 15, 'Jaime Lorente', 76.50, '2024-02-15', 0, 'AB-', 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Premios_Goya_2020_-_Jaime_Lorente_%28cropped%29.jpg'),
(39, 16, 'Ester Expósito', 55.00, '2024-04-21', 1, '0-', 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Goyas_2025_-_Ester_Exp%C3%B3sito_%28cropped2%29.jpg'),
(40, 16, 'Arón Piper', 72.00, '2024-04-22', 0, 'A+', 'https://upload.wikimedia.org/wikipedia/commons/2/22/Aron_Canet._Presentacion_EG0%2C0_Moto3_%2840634667171%29.jpg'),
(41, 17, 'Madre Teresa', 50.00, '2024-09-16', 0, '0-', 'https://upload.wikimedia.org/wikipedia/commons/8/8e/MotherTeresa_090.jpg'),
(42, 17, 'Padre Ángel', 75.00, '2024-09-17', 0, 'A+', 'https://upload.wikimedia.org/wikipedia/commons/2/2a/El_Padre_%C3%81ngel_en_julio_de_2013.jpg'),
(43, 18, 'Jon Nieve', 80.00, '2024-01-20', 1, 'B-', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Jon_Snow_and_Ghost.jpg'),
(44, 18, 'Daenerys T.', 55.00, '2024-01-25', 0, 'AB+', 'https://upload.wikimedia.org/wikipedia/commons/5/56/Daenerys.jpg'),
(45, 19, 'Presidente Uno', 85.00, '2024-12-27', 0, 'A+', 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Chuck_Grassley_official_photo_2017.jpg'),
(46, 19, 'Ministra Dos', 60.00, '2024-12-28', 1, '0+', 'https://upload.wikimedia.org/wikipedia/commons/b/b3/M%C3%B3nica_Garc%C3%ADa_2023_%28cropped%29.jpg'),
(47, 19, 'Ministra Tres', 60.00, '2024-12-28', 1, '0-', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Margarita_Robles_2020_%28cropped%29.jpg'),
(48, 1, 'Laura borrar', 65.50, '2024-03-02', 1, 'AB-', 'https://upload.wikimedia.org/wikipedia/commons/6/68/Ana_Garc%C3%ADa_Car%C3%ADas_%28Visita_de_Estado_a_Ecuador_-_2017%29.jpg'),
(49, 20, 'Rimuru Tempest', 55.00, '2026-02-04', 0, 'AB-', 'https://upload.wikimedia.org/wikipedia/commons/7/7f/TenseiShitaraLogo01.png');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `campaña`
--
ALTER TABLE `campaña`
  ADD PRIMARY KEY (`id_campana`);

--
-- Indices de la tabla `donacion`
--
ALTER TABLE `donacion`
  ADD PRIMARY KEY (`id_donacion`),
  ADD KEY `fk_campana_donacion` (`id_campana`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `campaña`
--
ALTER TABLE `campaña`
  MODIFY `id_campana` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `donacion`
--
ALTER TABLE `donacion`
  MODIFY `id_donacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `donacion`
--
ALTER TABLE `donacion`
  ADD CONSTRAINT `fk_campana_donacion` FOREIGN KEY (`id_campana`) REFERENCES `campaña` (`id_campana`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 03-01-2026 a las 20:03:16
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
(2, 'Emergencia Verano', 250.50, '2024-07-01', '2024-08-31', 1),
(3, 'Colecta Hospital Central', 500.00, '2024-01-10', '2024-12-20', 0),
(4, 'Operación Salida Segura', 120.00, '2024-04-01', '2024-04-15', 1),
(5, 'Donación en Empresas Tech', 80.00, '2024-09-10', '2024-09-12', 0),
(6, 'Bus Solidario - Ruta Norte', 60.50, '2024-05-01', '2024-05-30', 0),
(7, 'Campaña Navideña', 150.00, '2024-12-01', '2024-12-24', 1),
(8, 'Jornadas de Salud Joven', 75.00, '2024-10-15', '2024-10-20', 0),
(10, 'Maratón Borrar', 1.00, '2024-03-01', '2024-03-05', 0);

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
  `grupo_sanguineo` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `donacion`
--

INSERT INTO `donacion` (`id_donacion`, `id_campana`, `nombre_donante`, `peso_donante`, `fecha_donacion`, `es_primera_vez`, `grupo_sanguineo`) VALUES
(1, 1, 'Laura Martínez', 65.50, '2024-03-02', 1, '0+'),
(2, 1, 'Pedro Rodríguez', 82.00, '2024-03-03', 0, 'A-'),
(3, 2, 'Ana García', 55.00, '2024-07-15', 0, 'B+'),
(4, 2, 'Carlos Ruiz', 90.20, '2024-07-20', 1, 'AB-'),
(5, 3, 'María López', 68.00, '2024-02-10', 0, '0-'),
(6, 4, 'Javier Sánchez', 74.50, '2024-04-05', 0, 'A+'),
(7, 5, 'Elena White', 60.00, '2024-09-11', 1, '0+'),
(8, 6, 'Miguel Ángel Torres', 88.00, '2024-05-15', 0, 'B-'),
(9, 7, 'Lucía Fernández', 58.50, '2024-12-10', 1, 'AB+'),
(10, 8, 'David Broncano', 77.00, '2024-10-16', 0, 'A+'),
(12, 1, 'Laura borrar', 65.50, '2024-03-02', 1, '0-');

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
  MODIFY `id_campana` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `donacion`
--
ALTER TABLE `donacion`
  MODIFY `id_donacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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

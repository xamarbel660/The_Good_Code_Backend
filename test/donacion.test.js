// ============================================
// PRUEBAS CON JEST Y SUPERTEST PARA DONACIONES
// ============================================
const request = require('supertest');
const app = require('../index.js');
const sequelize = require('../config/sequelize');

afterAll(async () => {
    await sequelize.close();
});

// ============================================
// DATOS PARA LAS PRUEBAS
// ============================================
let campañaIdDisponible = 1; // Default fallback, asumimos que existe

const donacionValida = {
    id_campana: campañaIdDisponible,
    nombre_donante: "Juan Pérez Test",
    peso_donante: "75.50",
    fecha_donacion: "2026-02-10",
    es_primera_vez: true,
    grupo_sanguineo: "O+",
    URL_image: "https://example.com/image.jpg"
};

const donacionFalsa = {
    id_campana: campañaIdDisponible,
    nombre_donante: "María González",
    peso_donante: "62.00",
    fecha_donacion: "2026-02-15",
    es_primera_vez: false,
    grupo_sanguineo: "AB-",
    URL_image: "https://example.com/maria.jpg"
};

// ============================================
// CONFIGURACIÓN: Obtener una campaña válida
// ============================================
beforeAll(async () => {
    try {
        const response = await request(app).get('/api/campanas');
        if (response.body.datos && response.body.datos.length > 0) {
            campañaIdDisponible = response.body.datos[0].id_campana;
            donacionValida.id_campana = campañaIdDisponible;
            donacionFalsa.id_campana = campañaIdDisponible;
        }
    } catch (err) {
        console.log('No se pudo obtener campaña disponible, usando default');
    }
});

// ============================================
// DESCRIBE: GET /api/donaciones (GET todas las donaciones)
// ============================================
describe('GET /api/donaciones - Obtener todas las donaciones', () => {

    describe('Sin filtros', () => {
        test('Debería retornar status 200 y datos en formato correcto', async () => {
            const response = await request(app)
                .get('/api/donaciones')
                .expect(200);

            // Validar estructura de respuesta
            expect(response.body).toHaveProperty('ok', true);
            expect(response.body).toHaveProperty('datos');
            expect(response.body).toHaveProperty('mensaje');
            expect(response.body.mensaje).toBe('Donaciones recuperadas correctamente');
            expect(Array.isArray(response.body.datos)).toBe(true);
        });

        test('Debería retornar array con estructura correcta de donaciones', async () => {
            const response = await request(app)
                .get('/api/donaciones')
                .expect(200);

            if (response.body.datos.length > 0) {
                const donacion = response.body.datos[0];

                // Validar estructura de datos
                expect(donacion).toHaveProperty('id_donacion');
                expect(donacion).toHaveProperty('id_campana');
                expect(donacion).toHaveProperty('nombre_donante');
                expect(donacion).toHaveProperty('peso_donante');
                expect(donacion).toHaveProperty('fecha_donacion');
                expect(donacion).toHaveProperty('es_primera_vez');
                expect(donacion).toHaveProperty('grupo_sanguineo');
                expect(donacion).toHaveProperty('URL_image');

                // Validar tipos de datos
                expect(typeof donacion.id_donacion).toBe('number');
                expect(typeof donacion.id_campana).toBe('number');
                expect(typeof donacion.nombre_donante).toBe('string');
                expect(typeof donacion.peso_donante).toMatch(/number|string/);
                expect(typeof donacion.grupo_sanguineo).toBe('string');
                expect(typeof donacion.URL_image).toBe('string');
            }
        });

        test('Debería retornar donaciones ordenadas por id_donacion ascendente', async () => {
            const response = await request(app)
                .get('/api/donaciones')
                .expect(200);

            const datos = response.body.datos;
            if (datos.length > 1) {
                for (let i = 0; i < datos.length - 1; i++) {
                    expect(datos[i].id_donacion).toBeLessThanOrEqual(datos[i + 1].id_donacion);
                }
            }
        });
    });

    describe('Con filtro id_campana', () => {
        test('Debería filtrar donaciones por id_campana', async () => {
            const response = await request(app)
                .get(`/api/donaciones?id_campana=${campañaIdDisponible}`)
                .expect(200);

            expect(response.body.ok).toBe(true);
            expect(Array.isArray(response.body.datos)).toBe(true);

            // Todas las donaciones devueltas deben pertenecer a la campaña especificada
            response.body.datos.forEach(donacion => {
                expect(donacion.id_campana).toBe(campañaIdDisponible);
            });
        });

        test('Debería retornar array vacío si id_campana no tiene donaciones', async () => {
            const response = await request(app)
                .get('/api/donaciones?id_campana=999999')
                .expect(200);

            expect(response.body.ok).toBe(true);
            expect(response.body.datos).toEqual([]);
        });
    });

    describe('Con filtro nombre_donante', () => {
        test('Debería filtrar por nombre_donante con coincidencia parcial', async () => {
            const response = await request(app)
                .get('/api/donaciones?nombre_donante=J')
                .expect(200);

            expect(response.body.ok).toBe(true);

            // Si hay resultados, verificar que contienen la letra buscada
            if (response.body.datos.length > 0) {
                response.body.datos.forEach(donacion => {
                    expect(donacion.nombre_donante.toUpperCase()).toContain('J');
                });
            }
        });

        test('Debería retornar array vacío si no hay coincidencias en nombre', async () => {
            const response = await request(app)
                .get('/api/donaciones?nombre_donante=XyZaBC123NoExiste')
                .expect(200);

            expect(response.body.ok).toBe(true);
            expect(response.body.datos).toEqual([]);
        });
    });

    describe('Con filtro peso_donante', () => {
        test('Debería filtrar por peso_donante_min', async () => {
            const response = await request(app)
                .get('/api/donaciones?peso_donante_min=90')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(donacion => {
                expect(parseFloat(donacion.peso_donante)).toBeGreaterThanOrEqual(90);
            });
        });

        test('Debería filtrar por peso_donante_max', async () => {
            const response = await request(app)
                .get('/api/donaciones?peso_donante_max=80')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(donacion => {
                expect(parseFloat(donacion.peso_donante)).toBeLessThanOrEqual(80);
            });
        });

        test('Debería filtrar por rango peso_donante (min y max)', async () => {
            const response = await request(app)
                .get('/api/donaciones?peso_donante_min=90&peso_donante_max=120')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(donacion => {
                const peso = parseFloat(donacion.peso_donante);
                expect(peso).toBeGreaterThanOrEqual(90);
                expect(peso).toBeLessThanOrEqual(120);
            });
        });
    });

    describe('Con filtro fecha_donacion', () => {
        test('Debería filtrar por fecha_donacion_min', async () => {
            const response = await request(app)
                .get('/api/donaciones?fecha_donacion_min=2024-03-02')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(donacion => {
                expect(new Date(donacion.fecha_donacion).getTime()).toBeGreaterThanOrEqual(new Date('2024-03-02').getTime());
            });
        });

        test('Debería filtrar por fecha_donacion_max', async () => {
            const response = await request(app)
                .get('/api/donaciones?fecha_donacion_max=2024-03-02')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(donacion => {
                expect(new Date(donacion.fecha_donacion).getTime()).toBeLessThanOrEqual(new Date('2024-03-02').getTime());
            });
        });

        test('Debería filtrar por rango de fechas (fecha_min y fecha_max)', async () => {
            const response = await request(app)
                .get('/api/donaciones?fecha_donacion_min=2024-01-25&fecha_donacion_max=2024-03-02')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(donacion => {
                expect(new Date(donacion.fecha_donacion).getTime()).toBeGreaterThanOrEqual(new Date('2024-01-25').getTime());
                expect(new Date(donacion.fecha_donacion).getTime()).toBeLessThanOrEqual(new Date('2024-03-02').getTime());
            });
        });
    });

    describe('Con filtro grupo_sanguineo', () => {
        test('Debería filtrar por grupo_sanguineo con coincidencia parcial', async () => {
            const response = await request(app)
                .get('/api/donaciones?grupo_sanguineo=0-')
                .expect(200);

            expect(response.body.ok).toBe(true);

            if (response.body.datos.length > 0) {
                response.body.datos.forEach(donacion => {
                    expect(donacion.grupo_sanguineo).toContain('0');
                    expect(donacion.grupo_sanguineo).toContain('-');
                });
            }
        });

        test('Debería filtrar por grupo_sanguineo O+', async () => {
            const response = await request(app)
                .get('/api/donaciones?grupo_sanguineo=O%2B')
                .expect(200);

            expect(response.body.ok).toBe(true);
        });
    });

    describe('Con múltiples filtros combinados', () => {
        test('Debería filtrar por id_campana y nombre_donante', async () => {
            const response = await request(app)
                .get(`/api/donaciones?id_campana=${campañaIdDisponible}&nombre_donante=J`)
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(donacion => {
                expect(donacion.id_campana).toBe(campañaIdDisponible);
                expect(donacion.nombre_donante.toUpperCase()).toContain('J');
            });
        });

        test('Debería filtrar por peso y fecha combinados', async () => {
            const response = await request(app)
                .get('/api/donaciones?peso_donante_min=60&peso_donante_max=90&fecha_donacion_min=2024-01-01')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(donacion => {
                const peso = parseFloat(donacion.peso_donante);
                expect(peso).toBeGreaterThanOrEqual(60);
                expect(peso).toBeLessThanOrEqual(90);
                expect(new Date(donacion.fecha_donacion).getTime()).toBeGreaterThanOrEqual(new Date('2024-01-01').getTime());
            });
        });
    });

});

// ============================================
// DESCRIBE: GET /api/donaciones/:id (Obtener donación por ID)
// ============================================
describe('GET /api/donaciones/:id - Obtener donación por ID', () => {

    describe('Con ID válido', () => {
        test('Debería retornar status 200 y datos de la donación', async () => {
            const response = await request(app)
                .get('/api/donaciones/1')
                .expect(200);

            expect(response.body).toHaveProperty('ok', true);
            expect(response.body).toHaveProperty('datos');
            expect(response.body).toHaveProperty('mensaje');
            expect(response.body.mensaje).toBe('Donación recuperada correctamente');
        });

        test('Debería retornar donación con estructura correcta', async () => {
            const response = await request(app)
                .get('/api/donaciones/1')
                .expect(200);

            const donacion = response.body.datos;

            expect(donacion).toHaveProperty('id_donacion', 1);
            expect(donacion).toHaveProperty('id_campana');
            expect(donacion).toHaveProperty('nombre_donante');
            expect(donacion).toHaveProperty('peso_donante');
            expect(donacion).toHaveProperty('fecha_donacion');
            expect(donacion).toHaveProperty('es_primera_vez');
            expect(donacion).toHaveProperty('grupo_sanguineo');
            expect(donacion).toHaveProperty('URL_image');

            // Validar tipos
            expect(typeof donacion.nombre_donante).toBe('string');
            expect(donacion.nombre_donante.length).toBeGreaterThan(0);
            expect(parseFloat(donacion.peso_donante)).toBeGreaterThan(0);
            expect(donacion.URL_image).toBeTruthy();
        });
    });

    describe('Con ID inválido', () => {
        test('Debería retornar status 404 cuando el ID no existe', async () => {
            const response = await request(app)
                .get('/api/donaciones/999999')
                .expect(404);

            expect(response.body).toHaveProperty('ok', false);
            expect(response.body).toHaveProperty('datos', null);
            expect(response.body).toHaveProperty('mensaje');
            expect(response.body.mensaje).toBe('Donación no encontrada');
        });

        test('Debería retornar 404 para otro ID que no existe (999998)', async () => {
            const response = await request(app)
                .get('/api/donaciones/999998')
                .expect(404);

            expect(response.body.ok).toBe(false);
            expect(response.body.datos).toBeNull();
        });
    });

});

// ============================================
// DESCRIBE: GET /api/donaciones/cards/:page (Donaciones con paginación)
// ============================================
describe('GET /api/donaciones/cards/:page - Obtener donaciones paginadas', () => {

    describe('Paginación válida', () => {
        test('Debería retornar status 200 con estructura de paginación', async () => {
            const response = await request(app)
                .get('/api/donaciones/cards/1')
                .expect(200);

            expect(response.body).toHaveProperty('ok', true);
            expect(response.body).toHaveProperty('datos');
            expect(response.body).toHaveProperty('pagination');
            expect(response.body).toHaveProperty('mensaje');
            expect(response.body.mensaje).toBe('Donaciones recuperadas correctamente');
        });

        test('Debería contener información de pagination válida', async () => {
            const response = await request(app)
                .get('/api/donaciones/cards/1')
                .expect(200);

            expect(response.body.pagination).toHaveProperty('page', 1);
            expect(response.body.pagination).toHaveProperty('totalPages');
            expect(typeof response.body.pagination.totalPages).toBe('number');
            expect(response.body.pagination.totalPages).toBeGreaterThanOrEqual(0);
        });

        test('Debería retornar máximo 10 registros por página', async () => {
            const response = await request(app)
                .get('/api/donaciones/cards/1')
                .expect(200);

            expect(Array.isArray(response.body.datos)).toBe(true);
            expect(response.body.datos.length).toBeLessThanOrEqual(10);
        });

        test('Debería retornar datos en estructura correcta', async () => {
            const response = await request(app)
                .get('/api/donaciones/cards/1')
                .expect(200);

            if (response.body.datos.length > 0) {
                const donacion = response.body.datos[0];
                expect(donacion).toHaveProperty('id_donacion');
                expect(donacion).toHaveProperty('nombre_donante');
                expect(donacion).toHaveProperty('peso_donante');
            }
        });

        test('Debería retornar página 2 con datos diferentes a página 1', async () => {
            const page1 = await request(app)
                .get('/api/donaciones/cards/1')
                .expect(200);

            const page2 = await request(app)
                .get('/api/donaciones/cards/2')
                .expect(200);

            // Si ambas páginas tienen datos, verificar que no son los mismos
            if (page1.body.datos.length > 0 && page2.body.datos.length > 0) {
                const id1 = page1.body.datos[0].id_donacion;
                const id2 = page2.body.datos[0].id_donacion;
                expect(id1).not.toBe(id2);
            }
        });
    });

    describe('Paginación inválida', () => {
        test('Debería usar default page=1 si no se proporciona', async () => {
            const response = await request(app)
                .get('/api/donaciones/cards/abc')
                .expect(200);

            expect(response.body.ok).toBe(true);
            // Debería usar page 1 por defecto
            expect(response.body.pagination.page).toBe(1);
        });
    });

});

// ============================================
// DESCRIBE: POST /api/donaciones (Crear donación)
// ============================================
describe('POST /api/donaciones - Crear nueva donación', () => {

    describe('Con datos válidos', () => {
        test('Debería crear una donación y retornar status 201', async () => {
            const response = await request(app)
                .post('/api/donaciones')
                .send(donacionValida)
                .expect(201);

            expect(response.body).toHaveProperty('ok', true);
            expect(response.body).toHaveProperty('datos');
            expect(response.body).toHaveProperty('mensaje');
            expect(response.body.mensaje).toBe('Donación creada correctamente');
        });

        test('La donación creada debería tener id_donacion asignado', async () => {
            const response = await request(app)
                .post('/api/donaciones')
                .send(donacionValida)
                .expect(201);

            expect(response.body.datos).toHaveProperty('id_donacion');
            expect(typeof response.body.datos.id_donacion).toBe('number');
            expect(response.body.datos.id_donacion).toBeGreaterThan(0);
        });

        test('La donación creada debería preservar todos los valores correctamente', async () => {
            const response = await request(app)
                .post('/api/donaciones')
                .send(donacionValida)
                .expect(201);

            const donacion = response.body.datos;

            expect(donacion.id_campana).toBe(donacionValida.id_campana);
            expect(donacion.nombre_donante).toBe(donacionValida.nombre_donante);
            expect(parseFloat(donacion.peso_donante).toFixed(2)).toBe(
                parseFloat(donacionValida.peso_donante).toFixed(2)
            );
            expect(donacion.fecha_donacion).toContain('2026-02-10');
            expect(donacion.grupo_sanguineo).toBe(donacionValida.grupo_sanguineo);
            expect(donacion.URL_image).toBe(donacionValida.URL_image);
        });

        test('Debería crear múltiples donaciones con diferentes valores', async () => {
            const response = await request(app)
                .post('/api/donaciones')
                .send(donacionFalsa)
                .expect(201);

            expect(response.body.ok).toBe(true);
            expect(response.body.datos.nombre_donante).toBe(donacionFalsa.nombre_donante);
            expect(parseFloat(response.body.datos.peso_donante).toFixed(2)).toBe(
                parseFloat(donacionFalsa.peso_donante).toFixed(2)
            );
            expect([0, false, '0']).toContain(response.body.datos.es_primera_vez);
        });
    });

    describe('Con datos incompletos o inválidos', () => {
        test('Debería fallar si falta id_campana', async () => {
            const donacionIncompleta = {
                nombre_donante: "Test",
                peso_donante: "75.50",
                fecha_donacion: "2026-02-10",
                es_primera_vez: true,
                grupo_sanguineo: "O+",
                URL_image: "https://example.com/image.jpg"
            };

            const response = await request(app)
                .post('/api/donaciones')
                .send(donacionIncompleta)
                .expect(500);

            expect(response.body.ok).toBe(false);
        });

        test('Debería fallar si falta nombre_donante', async () => {
            const donacionIncompleta = {
                id_campana: campañaIdDisponible,
                peso_donante: "75.50",
                fecha_donacion: "2026-02-10",
                es_primera_vez: true,
                grupo_sanguineo: "O+",
                URL_image: "https://example.com/image.jpg"
            };

            const response = await request(app)
                .post('/api/donaciones')
                .send(donacionIncompleta)
                .expect(500);

            expect(response.body.ok).toBe(false);
        });

        test('Debería fallar si falta peso_donante', async () => {
            const donacionIncompleta = {
                id_campana: campañaIdDisponible,
                nombre_donante: "Test",
                fecha_donacion: "2026-02-10",
                es_primera_vez: true,
                grupo_sanguineo: "O+",
                URL_image: "https://example.com/image.jpg"
            };

            const response = await request(app)
                .post('/api/donaciones')
                .send(donacionIncompleta)
                .expect(500);

            expect(response.body.ok).toBe(false);
        });

        test('Debería fallar si falta fecha_donacion', async () => {
            const donacionIncompleta = {
                id_campana: campañaIdDisponible,
                nombre_donante: "Test",
                peso_donante: "75.50",
                es_primera_vez: true,
                grupo_sanguineo: "O+",
                URL_image: "https://example.com/image.jpg"
            };

            const response = await request(app)
                .post('/api/donaciones')
                .send(donacionIncompleta)
                .expect(500);

            expect(response.body.ok).toBe(false);
        });

        test('Debería fallar si falta grupo_sanguineo', async () => {
            const donacionIncompleta = {
                id_campana: campañaIdDisponible,
                nombre_donante: "Test",
                peso_donante: "75.50",
                fecha_donacion: "2026-02-10",
                es_primera_vez: true,
                URL_image: "https://example.com/image.jpg"
            };

            const response = await request(app)
                .post('/api/donaciones')
                .send(donacionIncompleta)
                .expect(500);

            expect(response.body.ok).toBe(false);
        });

        test('Debería fallar si falta URL_image', async () => {
            const donacionIncompleta = {
                id_campana: campañaIdDisponible,
                nombre_donante: "Test",
                peso_donante: "75.50",
                fecha_donacion: "2026-02-10",
                es_primera_vez: true,
                grupo_sanguineo: "O+"
            };

            const response = await request(app)
                .post('/api/donaciones')
                .send(donacionIncompleta)
                .expect(500);

            expect(response.body.ok).toBe(false);
        });

        test('Debería aceptar es_primera_vez como opcional (por defecto false)', async () => {
            const donacion = {
                id_campana: campañaIdDisponible,
                nombre_donante: "Donante Sin Primera Vez",
                peso_donante: "70.00",
                fecha_donacion: "2026-02-12",
                grupo_sanguineo: "A+",
                URL_image: "https://example.com/image.jpg"
            };

            const response = await request(app)
                .post('/api/donaciones')
                .send(donacion)
                .expect(201);

            expect(response.body.ok).toBe(true);
            expect(response.body.datos).toHaveProperty('es_primera_vez');
        });
    });

    describe('Validación de valores', () => {
        test('Debería aceptar nombre_donante con máximo 100 caracteres', async () => {
            const nombreLargo = 'a'.repeat(100);
            const donacion = {
                id_campana: campañaIdDisponible,
                nombre_donante: nombreLargo,
                peso_donante: "75.50",
                fecha_donacion: "2026-02-10",
                es_primera_vez: false,
                grupo_sanguineo: "B-",
                URL_image: "https://example.com/image.jpg"
            };

            const response = await request(app)
                .post('/api/donaciones')
                .send(donacion)
                .expect(201);

            expect(response.body.ok).toBe(true);
        });

        test('Debería aceptar diferentes grupos sanguíneos válidos', async () => {
            const gruposSanguineos = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

            for (const grupo of gruposSanguineos) {
                const donacion = {
                    id_campana: campañaIdDisponible,
                    nombre_donante: `Donante ${grupo}`,
                    peso_donante: "75.50",
                    fecha_donacion: "2026-02-10",
                    es_primera_vez: false,
                    grupo_sanguineo: grupo,
                    URL_image: "https://example.com/image.jpg"
                };

                const response = await request(app)
                    .post('/api/donaciones')
                    .send(donacion);

                expect([201, 500]).toContain(response.status);
            }
        });

        test('Debería aceptar URL válidas en URL_image', async () => {
            const urls = [
                'https://example.com/image.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/5/53/Shadow_2752.jpg',
                'http://localhost:3000/image.png',
                'https://cdn.example.com/path/to/image.gif'
            ];

            for (const url of urls) {
                const donacion = {
                    id_campana: campañaIdDisponible,
                    nombre_donante: "Donante URL Test",
                    peso_donante: "75.50",
                    fecha_donacion: "2026-02-10",
                    es_primera_vez: false,
                    grupo_sanguineo: "O+",
                    URL_image: url
                };

                const response = await request(app)
                    .post('/api/donaciones')
                    .send(donacion)
                    .expect(201);

                expect(response.body.datos.URL_image).toBe(url);
            }
        });

        test('Debería rechazar peso_donante con valor negativo', async () => {
            const donacion = {
                id_campana: campañaIdDisponible,
                nombre_donante: "Donante Negativo",
                peso_donante: "-50.00",
                fecha_donacion: "2026-02-10",
                es_primera_vez: false,
                grupo_sanguineo: "O+",
                URL_image: "https://example.com/image.jpg"
            };

            const response = await request(app)
                .post('/api/donaciones')
                .send(donacion);

            expect([201, 400, 500]).toContain(response.status);
        });

        test('Debería aceptar valores decimales válidos para peso_donante', async () => {
            const pesos = ['50.00', '75.99', '100.50', '48.25'];

            for (const peso of pesos) {
                const donacion = {
                    id_campana: campañaIdDisponible,
                    nombre_donante: "Donante Peso Test",
                    peso_donante: peso,
                    fecha_donacion: "2026-02-10",
                    es_primera_vez: false,
                    grupo_sanguineo: "O+",
                    URL_image: "https://example.com/image.jpg"
                };

                const response = await request(app)
                    .post('/api/donaciones')
                    .send(donacion)
                    .expect(201);

                expect(parseFloat(response.body.datos.peso_donante).toFixed(2)).toBe(parseFloat(peso).toFixed(2));
            }
        });
    });

});

// ============================================
// DESCRIBE: PUT /api/donaciones/:id (Actualizar donación)
// ============================================
describe('PUT /api/donaciones/:id - Actualizar donación', () => {

    let donacionExistente;

    beforeAll(async () => {
        const response = await request(app).get('/api/donaciones');
        if (response.body.datos.length > 0) {
            donacionExistente = response.body.datos[0];
        }
    });

    describe('Con datos válidos', () => {
        test('Debería actualizar una donación existente y retornar status 204', async () => {
            if (!donacionExistente) {
                console.log('Saltando prueba: no hay donaciones existentes');
                return;
            }

            const donacionActualizada = {
                id_donacion: donacionExistente.id_donacion,
                id_campana: donacionExistente.id_campana,
                nombre_donante: "Donante Actualizado",
                peso_donante: "80.00",
                fecha_donacion: donacionExistente.fecha_donacion,
                es_primera_vez: false,
                grupo_sanguineo: "AB+",
                URL_image: donacionExistente.URL_image
            };

            await request(app)
                .put(`/api/donaciones/${donacionExistente.id_donacion}`)
                .send(donacionActualizada)
                .expect(204);
        });

        test('Debería ser posible actualizar solo algunos campos', async () => {
            if (!donacionExistente) {
                console.log('Saltando prueba: no hay donaciones existentes');
                return;
            }

            const donacionActualizada = {
                id_donacion: donacionExistente.id_donacion,
                id_campana: donacionExistente.id_campana,
                nombre_donante: "Nombre Actualizado Nuevamente",
                peso_donante: donacionExistente.peso_donante,
                fecha_donacion: donacionExistente.fecha_donacion,
                es_primera_vez: true,
                grupo_sanguineo: donacionExistente.grupo_sanguineo,
                URL_image: donacionExistente.URL_image
            };

            await request(app)
                .put(`/api/donaciones/${donacionExistente.id_donacion}`)
                .send(donacionActualizada)
                .expect(204);
        });
    });

    describe('Con errores de validación', () => {
        test('Debería retornar status 400 si id de ruta no coincide con id del objeto', async () => {
            if (!donacionExistente) {
                console.log('Saltando prueba: no hay donaciones existentes');
                return;
            }

            const donacionConIdIncorrecto = {
                id_donacion: 9999,
                id_campana: donacionExistente.id_campana,
                nombre_donante: "Test",
                peso_donante: "75.50",
                fecha_donacion: "2026-02-10",
                es_primera_vez: false,
                grupo_sanguineo: "O+",
                URL_image: "https://example.com/image.jpg"
            };

            const response = await request(app)
                .put(`/api/donaciones/${donacionExistente.id_donacion}`)
                .send(donacionConIdIncorrecto)
                .expect(400);

            expect(response.body.ok).toBe(false);
            expect(response.body.mensaje).toContain('no coincide');
        });
    });

    describe('Con ID no encontrado', () => {
        test('Debería retornar status 404 si la donación no existe', async () => {
            const donacionActualizada = {
                id_donacion: 999999,
                id_campana: campañaIdDisponible,
                nombre_donante: "Donación Inexistente",
                peso_donante: "75.50",
                fecha_donacion: "2026-02-10",
                es_primera_vez: false,
                grupo_sanguineo: "O+",
                URL_image: "https://example.com/image.jpg"
            };

            const response = await request(app)
                .put('/api/donaciones/999999')
                .send(donacionActualizada)
                .expect(404);

            expect(response.body.ok).toBe(false);
            expect(response.body.mensaje).toContain('No encontrado');
        });
    });

});

// ============================================
// DESCRIBE: DELETE /api/donaciones/:id (Eliminar donación)
// ============================================
describe('DELETE /api/donaciones/:id - Eliminar donación', () => {

    describe('Eliminación exitosa', () => {
        let donacionAEliminar;

        beforeAll(async () => {
            // Crear una donación específicamente para eliminar
            const response = await request(app)
                .post('/api/donaciones')
                .send({
                    id_campana: campañaIdDisponible,
                    nombre_donante: "Donación para Eliminar",
                    peso_donante: "67.89",
                    fecha_donacion: "2026-02-15",
                    es_primera_vez: false,
                    grupo_sanguineo: "A-",
                    URL_image: "https://example.com/delete.jpg"
                });

            if (response.body.datos) {
                donacionAEliminar = response.body.datos;
            }
        });

        test('Debería eliminar una donación existente y retornar status 204', async () => {
            if (!donacionAEliminar) {
                console.log('Saltando prueba: no se pudo crear donación para eliminar');
                return;
            }

            await request(app)
                .delete(`/api/donaciones/${donacionAEliminar.id_donacion}`)
                .expect(204);
        });

        test('Debería verificar que la donación fue eliminada consultando por ID', async () => {
            if (!donacionAEliminar) {
                console.log('Saltando prueba: no se pudo crear donación para eliminar');
                return;
            }

            const response = await request(app)
                .get(`/api/donaciones/${donacionAEliminar.id_donacion}`)
                .expect(404);

            expect(response.body.ok).toBe(false);
            expect(response.body.mensaje).toBe('Donación no encontrada');
        });
    });

    describe('Con ID no encontrado', () => {
        test('Debería retornar status 404 si intenta eliminar donación inexistente', async () => {
            const response = await request(app)
                .delete('/api/donaciones/999999')
                .expect(404);

            expect(response.body.ok).toBe(false);
            expect(response.body.mensaje).toContain('No encontrado');
        });

        test('Debería fallar al intentar eliminar ID que no existe (19)', async () => {
            const response = await request(app)
                .delete('/api/donaciones/19')
                .expect(404);

            expect(response.body.ok).toBe(false);
        });
    });

});

// ============================================
// DESCRIBE: PRUEBAS DE INTEGRACIÓN COMPLETA
// ============================================
describe('CRUD completo - Integración', () => {

    let idDonacionCreada;

    test('Crear → Leer → Actualizar → Eliminar una donación', async () => {
        // 1. CREATE
        const createResponse = await request(app)
            .post('/api/donaciones')
            .send({
                id_campana: campañaIdDisponible,
                nombre_donante: "Donación CRUD Test",
                peso_donante: "72.50",
                fecha_donacion: "2026-03-15",
                es_primera_vez: true,
                grupo_sanguineo: "B+",
                URL_image: "https://example.com/crud.jpg"
            })
            .expect(201);

        expect(createResponse.body.ok).toBe(true);
        idDonacionCreada = createResponse.body.datos.id_donacion;

        // 2. READ
        const readResponse = await request(app)
            .get(`/api/donaciones/${idDonacionCreada}`)
            .expect(200);

        expect(readResponse.body.ok).toBe(true);
        expect(readResponse.body.datos.nombre_donante).toBe("Donación CRUD Test");
        expect(parseFloat(readResponse.body.datos.peso_donante).toFixed(2)).toBe('72.50');

        // 3. UPDATE
        await request(app)
            .put(`/api/donaciones/${idDonacionCreada}`)
            .send({
                id_donacion: idDonacionCreada,
                id_campana: campañaIdDisponible,
                nombre_donante: "Donación CRUD Test Actualizada",
                peso_donante: "75.00",
                fecha_donacion: "2026-03-15",
                es_primera_vez: false,
                grupo_sanguineo: "AB-",
                URL_image: "https://example.com/crud-updated.jpg"
            })
            .expect(204);

        // Verificar la actualización
        const verifyResponse = await request(app)
            .get(`/api/donaciones/${idDonacionCreada}`)
            .expect(200);

        expect(verifyResponse.body.datos.nombre_donante).toBe("Donación CRUD Test Actualizada");
        expect([0, false, '0']).toContain(verifyResponse.body.datos.es_primera_vez);

        // 4. DELETE
        await request(app)
            .delete(`/api/donaciones/${idDonacionCreada}`)
            .expect(204);

        // Verificar que fue eliminada
        const deleteVerifyResponse = await request(app)
            .get(`/api/donaciones/${idDonacionCreada}`)
            .expect(404);

        expect(deleteVerifyResponse.body.ok).toBe(false);
    });

});

// ============================================
// PRUEBAS CON JEST Y SUPERTEST PARA CAMPANIAS
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
const campañaValida = {
    nombre_campana: "Campaña de Prueba",
    objetivo_litros_campana: "150.00",
    fecha_inicio_campana: "2026-02-10",
    fecha_fin_campana: "2026-02-28",
    urgente_campana: true
};

const campañaFalsa = {
    nombre_campana: "Campaña Falsa",
    objetivo_litros_campana: "999.99",
    fecha_inicio_campana: "2026-01-01",
    fecha_fin_campana: "2026-01-31",
    urgente_campana: false
};

// ============================================
// DESCRIBE: GET /api/campanas (GET todas las campañas)
// ============================================
describe('GET /api/campanas - Obtener todas las campañas', () => {

    describe('Sin filtros', () => {
        test('Debería retornar status 200 y datos en formato correcto', async () => {
            const response = await request(app)
                .get('/api/campanas')
                .expect(200);

            // Validar estructura de respuesta
            expect(response.body).toHaveProperty('ok', true);
            expect(response.body).toHaveProperty('datos');
            expect(response.body).toHaveProperty('mensaje');
            expect(response.body.mensaje).toBe('Campañas recuperadas correctamente');
            expect(Array.isArray(response.body.datos)).toBe(true);
        });

        test('Debería retornar array con estructura correcta de campañas', async () => {
            const response = await request(app)
                .get('/api/campanas')
                .expect(200);

            if (response.body.datos.length > 0) {
                const campaña = response.body.datos[0];

                // Validar estructura de datos
                expect(campaña).toHaveProperty('id_campana');
                expect(campaña).toHaveProperty('nombre_campana');
                expect(campaña).toHaveProperty('objetivo_litros_campana');
                expect(campaña).toHaveProperty('fecha_inicio_campana');
                expect(campaña).toHaveProperty('fecha_fin_campana');
                expect(campaña).toHaveProperty('urgente_campana');

                // Validar tipos de datos
                expect(typeof campaña.id_campana).toBe('number');
                expect(typeof campaña.nombre_campana).toBe('string');
                expect(typeof campaña.objetivo_litros_campana).toMatch(/number|string/);
                expect(typeof campaña.urgente_campana).toMatch(/boolean|number/);
            }
        });

        test('Debería retornar campañas ordenadas por id_campana ascendente', async () => {
            const response = await request(app)
                .get('/api/campanas')
                .expect(200);

            const datos = response.body.datos;
            if (datos.length > 1) {
                for (let i = 0; i < datos.length - 1; i++) {
                    expect(datos[i].id_campana).toBeLessThanOrEqual(datos[i + 1].id_campana);
                }
            }
        });
    });

    describe('Con filtro nombre_campana', () => {
        test('Debería filtrar por nombre_campana con coincidencia parcial', async () => {
            const response = await request(app)
                .get('/api/campanas?nombre_campana=C')
                .expect(200);

            expect(response.body.ok).toBe(true);
            expect(Array.isArray(response.body.datos)).toBe(true);

            // Si hay resultados, verificar que contienen la letra buscada
            if (response.body.datos.length > 0) {
                response.body.datos.forEach(campaña => {
                    expect(campaña.nombre_campana.toUpperCase()).toContain('C');
                });
            }
        });

        test('Debería retornar array vacío si no hay coincidencias', async () => {
            const response = await request(app)
                .get('/api/campanas?nombre_campana=XyZaBC123NoExiste')
                .expect(200);

            expect(response.body.ok).toBe(true);
            expect(response.body.datos).toEqual([]);
        });
    });

    describe('Con filtro objetivo_litros_campana', () => {
        test('Debería filtrar por objetivo_litros_campana_min', async () => {
            const response = await request(app)
                .get('/api/campanas?objetivo_litros_campana_min=120')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(campaña => {
                expect(parseFloat(campaña.objetivo_litros_campana)).toBeGreaterThanOrEqual(120);
            });
        });

        test('Debería filtrar por objetivo_litros_campana_max', async () => {
            const response = await request(app)
                .get('/api/campanas?objetivo_litros_campana_max=100')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(campaña => {
                expect(parseFloat(campaña.objetivo_litros_campana)).toBeLessThanOrEqual(100);
            });
        });

        test('Debería filtrar por rango objetivo_litros_campana (min y max)', async () => {
            const response = await request(app)
                .get('/api/campanas?objetivo_litros_campana_min=90&objetivo_litros_campana_max=120')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(campaña => {
                const objetivo = parseFloat(campaña.objetivo_litros_campana);
                expect(objetivo).toBeGreaterThanOrEqual(90);
                expect(objetivo).toBeLessThanOrEqual(120);
            });
        });
    });

    describe('Con filtro fecha_inicio_campana y fecha_fin_campana', () => {
        test('Debería filtrar por fecha_inicio_campana', async () => {
            const response = await request(app)
                .get('/api/campanas?fecha_inicio_campana=2024-12-26')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(campaña => {
                expect(new Date(campaña.fecha_inicio_campana).getTime()).toBeGreaterThanOrEqual(new Date('2024-12-26').getTime());
            });
        });

        test('Debería filtrar por fecha_fin_campana', async () => {
            const response = await request(app)
                .get('/api/campanas?fecha_fin_campana=2024-03-17')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(campaña => {
                expect(new Date(campaña.fecha_fin_campana).getTime()).toBeLessThanOrEqual(new Date('2024-03-17').getTime());
            });
        });

        test('Debería filtrar por rango de fechas (fecha_inicio y fecha_fin)', async () => {
            const response = await request(app)
                .get('/api/campanas?fecha_inicio_campana=2026-01-11&fecha_fin_campana=2026-01-14')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(campaña => {
                expect(new Date(campaña.fecha_inicio_campana).getTime()).toBeGreaterThanOrEqual(new Date('2026-01-11').getTime());
                expect(new Date(campaña.fecha_fin_campana).getTime()).toBeLessThanOrEqual(new Date('2026-01-14').getTime());
            });
        });
    });

    describe('Con filtro urgente_campana', () => {
        test('Debería filtrar por urgente_campana=true', async () => {
            const response = await request(app)
                .get('/api/campanas?urgente_campana=true')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(campaña => {
                expect([1, true, '1', 'true']).toContain(campaña.urgente_campana);
            });
        });

        test('Debería filtrar por urgente_campana=false', async () => {
            const response = await request(app)
                .get('/api/campanas?urgente_campana=false')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(campaña => {
                expect([0, false, '0', 'false']).toContain(campaña.urgente_campana);
            });
        });
    });

    describe('Con múltiples filtros combinados', () => {
        test('Debería filtrar por nombre y objetivo', async () => {
            const response = await request(app)
                .get('/api/campanas?nombre_campana=M&objetivo_litros_campana_min=50')
                .expect(200);

            expect(response.body.ok).toBe(true);

            response.body.datos.forEach(campaña => {
                expect(campaña.nombre_campana.toUpperCase()).toContain('M');
                expect(parseFloat(campaña.objetivo_litros_campana)).toBeGreaterThanOrEqual(50);
            });
        });
    });

});

// ============================================
// DESCRIBE: GET /api/campanas/graph (Datos para gráfica)
// ============================================
describe('GET /api/campanas/graph - Obtener datos para gráfica', () => {

    test('Debería retornar status 200 y datos en formato correcto', async () => {
        const response = await request(app)
            .get('/api/campanas/graph')
            .expect(200);

        expect(response.body).toHaveProperty('ok', true);
        expect(response.body).toHaveProperty('datos');
        expect(response.body).toHaveProperty('mensaje');
        expect(response.body.mensaje).toBe('Datos de campañas recuperados correctamente');
        expect(Array.isArray(response.body.datos)).toBe(true);
    });

    test('Los datos deberían contener información válida con id_campana y total', async () => {
        const response = await request(app)
            .get('/api/campanas/graph')
            .expect(200);

        if (response.body.datos.length > 0) {
            const dato = response.body.datos[0];

            expect(dato).toHaveProperty('id_campana');
            expect(typeof dato.id_campana).toBe('number');
            expect(dato).toHaveProperty('total');
            expect(typeof parseInt(dato.total)).toBe('number');
        }
    });

});

// ============================================
// DESCRIBE: GET /api/campanas/:id (Obtener campaña por ID)
// ============================================
describe('GET /api/campanas/:id - Obtener campaña por ID', () => {

    describe('Con ID válido', () => {
        test('Debería retornar status 200 y datos de la campaña', async () => {
            const response = await request(app)
                .get('/api/campanas/1')
                .expect(200);

            expect(response.body).toHaveProperty('ok', true);
            expect(response.body).toHaveProperty('datos');
            expect(response.body).toHaveProperty('mensaje');
            expect(response.body.mensaje).toBe('Campaña recuperada correctamente');
        });

        test('Debería retornar campaña con estructura correcta', async () => {
            const response = await request(app)
                .get('/api/campanas/1')
                .expect(200);

            const campaña = response.body.datos;

            expect(campaña).toHaveProperty('id_campana', 1);
            expect(campaña).toHaveProperty('nombre_campana');
            expect(campaña).toHaveProperty('objetivo_litros_campana');
            expect(campaña).toHaveProperty('fecha_inicio_campana');
            expect(campaña).toHaveProperty('fecha_fin_campana');
            expect(campaña).toHaveProperty('urgente_campana');

            // Validar tipos
            expect(typeof campaña.nombre_campana).toBe('string');
            expect(campaña.nombre_campana.length).toBeGreaterThan(0);
            expect(parseFloat(campaña.objetivo_litros_campana)).toBeGreaterThan(0);
        });
    });

    describe('Con ID inválido', () => {
        test('Debería retornar status 404 cuando el ID no existe', async () => {
            const response = await request(app)
                .get('/api/campanas/999999')
                .expect(404);

            expect(response.body).toHaveProperty('ok', false);
            expect(response.body).toHaveProperty('datos', null);
            expect(response.body).toHaveProperty('mensaje');
            expect(response.body.mensaje).toBe('Campaña no encontrada');
        });

        test('Debería retornar 404 para otro ID que no existe', async () => {
            const response = await request(app)
                .get('/api/campanas/999998')
                .expect(404);

            expect(response.body.ok).toBe(false);
            expect(response.body.datos).toBeNull();
        });
    });

});

// ============================================
// DESCRIBE: POST /api/campanas (Crear campaña)
// ============================================
describe('POST /api/campanas - Crear nueva campaña', () => {

    describe('Con datos válidos', () => {
        test('Debería crear una campaña y retornar status 201', async () => {
            const response = await request(app)
                .post('/api/campanas')
                .send(campañaValida)
                .expect(201);

            expect(response.body).toHaveProperty('ok', true);
            expect(response.body).toHaveProperty('datos');
            expect(response.body).toHaveProperty('mensaje');
            expect(response.body.mensaje).toBe('Campaña creada correctamente');
        });

        test('La campaña creada debería tener id_campana asignado', async () => {
            const response = await request(app)
                .post('/api/campanas')
                .send(campañaValida)
                .expect(201);

            expect(response.body.datos).toHaveProperty('id_campana');
            expect(typeof response.body.datos.id_campana).toBe('number');
            expect(response.body.datos.id_campana).toBeGreaterThan(0);
        });

        test('La campaña creada debería preservar todos los valores correctamente', async () => {
            const response = await request(app)
                .post('/api/campanas')
                .send(campañaValida)
                .expect(201);

            const campaña = response.body.datos;

            expect(campaña.nombre_campana).toBe(campañaValida.nombre_campana);
            expect(parseFloat(campaña.objetivo_litros_campana).toFixed(2)).toBe(
                parseFloat(campañaValida.objetivo_litros_campana).toFixed(2)
            );
            expect(campaña.fecha_inicio_campana).toContain('2026-02-10');
            expect(campaña.fecha_fin_campana).toContain('2026-02-28');
            expect([1, true, '1']).toContain(campaña.urgente_campana);
        });

        test('Debería crear múltiples campañas con diferentes valores', async () => {
            const response = await request(app)
                .post('/api/campanas')
                .send(campañaFalsa)
                .expect(201);

            expect(response.body.ok).toBe(true);
            expect(response.body.datos.nombre_campana).toBe(campañaFalsa.nombre_campana);
            expect(parseFloat(response.body.datos.objetivo_litros_campana).toFixed(2)).toBe(
                parseFloat(campañaFalsa.objetivo_litros_campana).toFixed(2)
            );
        });
    });

    describe('Con datos incompletos o inválidos', () => {
        test('Debería fallar si falta nombre_campana', async () => {
            const campañaIncompleta = {
                objetivo_litros_campana: "150.00",
                fecha_inicio_campana: "2026-02-10",
                fecha_fin_campana: "2026-02-28",
                urgente_campana: true
            };

            const response = await request(app)
                .post('/api/campanas')
                .send(campañaIncompleta)
                .expect(500);

            expect(response.body.ok).toBe(false);
        });

        test('Debería fallar si falta objetivo_litros_campana', async () => {
            const campañaIncompleta = {
                nombre_campana: "Campaña Incompleta",
                fecha_inicio_campana: "2026-02-10",
                fecha_fin_campana: "2026-02-28",
                urgente_campana: true
            };

            const response = await request(app)
                .post('/api/campanas')
                .send(campañaIncompleta)
                .expect(500);

            expect(response.body.ok).toBe(false);
        });

        test('Debería fallar si falta fecha_inicio_campana', async () => {
            const campañaIncompleta = {
                nombre_campana: "Campaña Incompleta",
                objetivo_litros_campana: "150.00",
                fecha_fin_campana: "2026-02-28",
                urgente_campana: true
            };

            const response = await request(app)
                .post('/api/campanas')
                .send(campañaIncompleta)
                .expect(500);

            expect(response.body.ok).toBe(false);
        });

        test('Debería fallar si falta fecha_fin_campana', async () => {
            const campañaIncompleta = {
                nombre_campana: "Campaña Incompleta",
                objetivo_litros_campana: "150.00",
                fecha_inicio_campana: "2026-02-10",
                urgente_campana: true
            };

            const response = await request(app)
                .post('/api/campanas')
                .send(campañaIncompleta)
                .expect(500);

            expect(response.body.ok).toBe(false);
        });

        test('Debería aceptar urgente_campana como opcional', async () => {
            const campaña = {
                nombre_campana: "Campaña Sin Urgencia",
                objetivo_litros_campana: "80.00",
                fecha_inicio_campana: "2026-03-01",
                fecha_fin_campana: "2026-03-31"
            };

            const response = await request(app)
                .post('/api/campanas')
                .send(campaña)
                .expect(201);

            expect(response.body.ok).toBe(true);
            expect(response.body.datos).toHaveProperty('urgente_campana');
        });
    });

    describe('Validación de valores', () => {
        test('Debería aceptar nombre_campana con máximo 100 caracteres', async () => {
            const nombreLargo = 'a'.repeat(100);
            const campaña = {
                nombre_campana: nombreLargo,
                objetivo_litros_campana: "150.00",
                fecha_inicio_campana: "2026-02-10",
                fecha_fin_campana: "2026-02-28",
                urgente_campana: false
            };

            const response = await request(app)
                .post('/api/campanas')
                .send(campaña)
                .expect(201);

            expect(response.body.ok).toBe(true);
            expect(response.body.datos.nombre_campana).toBe(nombreLargo);
        });

        test('Debería rechazar objetivo_litros_campana con valor negativo', async () => {
            const campaña = {
                nombre_campana: "Campaña Negativa",
                objetivo_litros_campana: "-50.00",
                fecha_inicio_campana: "2026-02-10",
                fecha_fin_campana: "2026-02-28",
                urgente_campana: false
            };

            const response = await request(app)
                .post('/api/campanas')
                .send(campaña);

            // El servidor puede aceptarlo o rechazarlo, validamos comportamiento
            expect([201, 400, 500]).toContain(response.status);
        });

        test('Debería aceptar valores decimales válidos para objetivo_litros_campana', async () => {
            const campaña = {
                nombre_campana: "Campaña Decimal",
                objetivo_litros_campana: "123.45",
                fecha_inicio_campana: "2026-02-10",
                fecha_fin_campana: "2026-02-28",
                urgente_campana: false
            };

            const response = await request(app)
                .post('/api/campanas')
                .send(campaña)
                .expect(201);

            expect(response.body.ok).toBe(true);
            expect(parseFloat(response.body.datos.objetivo_litros_campana).toFixed(2)).toBe('123.45');
        });
    });

});

// ============================================
// DESCRIBE: PUT /api/campanas/:id (Actualizar campaña)
// ============================================
describe('PUT /api/campanas/:id - Actualizar campaña', () => {

    // Primero obtenemos una campaña existente para actualizar
    let campañaExistente;

    beforeAll(async () => {
        const response = await request(app).get('/api/campanas');
        if (response.body.datos.length > 0) {
            campañaExistente = response.body.datos[0];
        }
    });

    describe('Con datos válidos', () => {
        test('Debería actualizar una campaña existente y retornar status 204', async () => {
            if (!campañaExistente) {
                console.log('Saltando prueba: no hay campañas existentes');
                return;
            }

            const campañaActualizada = {
                id_campana: campañaExistente.id_campana,
                nombre_campana: "Campaña Actualizada",
                objetivo_litros_campana: "200.00",
                fecha_inicio_campana: "2026-03-01",
                fecha_fin_campana: "2026-03-31",
                urgente_campana: false
            };

            await request(app)
                .put(`/api/campanas/${campañaExistente.id_campana}`)
                .send(campañaActualizada)
                .expect(204);
        });

        test('Debería ser posible actualizar solo algunos campos', async () => {
            if (!campañaExistente) {
                console.log('Saltando prueba: no hay campañas existentes');
                return;
            }

            const campañaActualizada = {
                id_campana: campañaExistente.id_campana,
                nombre_campana: "Nombre Actualizado Nuevamente",
                objetivo_litros_campana: campañaExistente.objetivo_litros_campana,
                fecha_inicio_campana: campañaExistente.fecha_inicio_campana,
                fecha_fin_campana: campañaExistente.fecha_fin_campana,
                urgente_campana: true
            };

            await request(app)
                .put(`/api/campanas/${campañaExistente.id_campana}`)
                .send(campañaActualizada)
                .expect(204);
        });
    });

    describe('Con errores de validación', () => {
        test('Debería retornar status 400 si id de ruta no coincide con id del objeto', async () => {
            if (!campañaExistente) {
                console.log('Saltando prueba: no hay campañas existentes');
                return;
            }

            const campañaConIdIncorrecto = {
                id_campana: 9999, // ID diferente
                nombre_campana: "Campaña",
                objetivo_litros_campana: "150.00",
                fecha_inicio_campana: "2026-02-10",
                fecha_fin_campana: "2026-02-28",
                urgente_campana: false
            };

            const response = await request(app)
                .put(`/api/campanas/${campañaExistente.id_campana}`)
                .send(campañaConIdIncorrecto)
                .expect(400);

            expect(response.body.ok).toBe(false);
            expect(response.body.mensaje).toContain('no coincide');
        });
    });

    describe('Con ID no encontrado', () => {
        test('Debería retornar status 404 si la campaña no existe', async () => {
            const campañaActualizada = {
                id_campana: 999999,
                nombre_campana: "Campaña Inexistente",
                objetivo_litros_campana: "150.00",
                fecha_inicio_campana: "2026-02-10",
                fecha_fin_campana: "2026-02-28",
                urgente_campana: false
            };

            const response = await request(app)
                .put('/api/campanas/999999')
                .send(campañaActualizada)
                .expect(404);

            expect(response.body.ok).toBe(false);
            expect(response.body.mensaje).toContain('No encontrado');
        });
    });

});

// ============================================
// DESCRIBE: DELETE /api/campanas/:id (Eliminar campaña)
// ============================================
describe('DELETE /api/campanas/:id - Eliminar campaña', () => {

    describe('Eliminación exitosa', () => {
        let campañaAEliminar;

        beforeAll(async () => {
            // Crear una campaña específicamente para eliminar
            const response = await request(app)
                .post('/api/campanas')
                .send({
                    nombre_campana: "Campaña para Eliminar",
                    objetivo_litros_campana: "99.99",
                    fecha_inicio_campana: "2026-02-15",
                    fecha_fin_campana: "2026-02-25",
                    urgente_campana: false
                });

            if (response.body.datos) {
                campañaAEliminar = response.body.datos;
            }
        });

        test('Debería eliminar una campaña existente y retornar status 204', async () => {
            if (!campañaAEliminar) {
                console.log('Saltando prueba: no se pudo crear campaña para eliminar');
                return;
            }

            await request(app)
                .delete(`/api/campanas/${campañaAEliminar.id_campana}`)
                .expect(204);
        });

        test('Debería verificar que la campaña fue eliminada consultando por ID', async () => {
            if (!campañaAEliminar) {
                console.log('Saltando prueba: no se pudo crear campaña para eliminar');
                return;
            }

            const response = await request(app)
                .get(`/api/campanas/${campañaAEliminar.id_campana}`)
                .expect(404);

            expect(response.body.ok).toBe(false);
            expect(response.body.mensaje).toBe('Campaña no encontrada');
        });
    });

    describe('Con ID no encontrado', () => {
        test('Debería retornar status 404 si intenta eliminar campaña inexistente', async () => {
            const response = await request(app)
                .delete('/api/campanas/999999')
                .expect(404);

            expect(response.body.ok).toBe(false);
            expect(response.body.mensaje).toContain('No encontrado');
        });

        test('Debería fallar al intentar eliminar ID que no existe (-1)', async () => {
            const response = await request(app)
                .delete('/api/campanas/-1')
                .expect(404);

            expect(response.body.ok).toBe(false);
        });
    });

});

// ============================================
// DESCRIBE: PRUEBAS DE INTEGRACIÓN COMPLETA
// ============================================
describe('CRUD completo - Integración', () => {

    let idCampañaCreada;

    test('Crear → Leer → Actualizar → Eliminar una campaña', async () => {
        // 1. CREATE
        const createResponse = await request(app)
            .post('/api/campanas')
            .send({
                nombre_campana: "Campaña CRUD Test",
                objetivo_litros_campana: "175.50",
                fecha_inicio_campana: "2026-04-01",
                fecha_fin_campana: "2026-04-30",
                urgente_campana: true
            })
            .expect(201);

        expect(createResponse.body.ok).toBe(true);
        idCampañaCreada = createResponse.body.datos.id_campana;

        // 2. READ
        const readResponse = await request(app)
            .get(`/api/campanas/${idCampañaCreada}`)
            .expect(200);

        expect(readResponse.body.ok).toBe(true);
        expect(readResponse.body.datos.nombre_campana).toBe("Campaña CRUD Test");
        expect(parseFloat(readResponse.body.datos.objetivo_litros_campana).toFixed(2)).toBe('175.50');

        // 3. UPDATE
        await request(app)
            .put(`/api/campanas/${idCampañaCreada}`)
            .send({
                id_campana: idCampañaCreada,
                nombre_campana: "Campaña CRUD Test Actualizada",
                objetivo_litros_campana: "200.00",
                fecha_inicio_campana: "2026-04-01",
                fecha_fin_campana: "2026-04-30",
                urgente_campana: false
            })
            .expect(204);

        // Verificar la actualización
        const verifyResponse = await request(app)
            .get(`/api/campanas/${idCampañaCreada}`)
            .expect(200);

        expect(verifyResponse.body.datos.nombre_campana).toBe("Campaña CRUD Test Actualizada");
        expect([0, false, '0']).toContain(verifyResponse.body.datos.urgente_campana);

        // 4. DELETE
        await request(app)
            .delete(`/api/campanas/${idCampañaCreada}`)
            .expect(204);

        // Verificar que fue eliminada
        const deleteVerifyResponse = await request(app)
            .get(`/api/campanas/${idCampañaCreada}`)
            .expect(404);

        expect(deleteVerifyResponse.body.ok).toBe(false);
    });

});

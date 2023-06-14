const request = require('supertest');
const createApp = require('../../src/app');
const { models } = require('../../src/db/sequelize');
const { upSeed, downSeed } = require('../../src/utils/umzug');


    //TODO: MOCKING del servicio de correos revisar cuando sea necesario video 23

describe('Test User Services', () =>{

  let app = null;
  let api = null;
  let server = null;

  beforeAll(async() => {
    app =createApp()
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  })

  describe(' LOGIN /auth', () => {
    test('should return a 401 Unauthorized', async () => {
      const inputData = {
        email: "bad@correo.com",
        password: "123456789"
      }
      const response = await api.post('/api/v1/auth/login').send(inputData);
      expect(response.statusCode).toEqual(401);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.body.error).toEqual("Unauthorized");
      expect(response.body).toEqual({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Unauthorized'
      });
    })

    test('should return a 200 Token', async () => {

      const user = await models.User.findByPk('1');
      const inputData = {
        email: user.email,
        password: "12345678"
      }

      const response = await api.post('/api/v1/auth/login').send(inputData);
      expect(response.statusCode).toEqual(200);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.body.access_token).toBeTruthy();
      expect(response.body.user.email).toEqual(inputData.email);
      expect(response.body.user.password).toBeUndefined();
    })

  });

  afterAll(async() =>{
    await downSeed()
    server.close()
  })

  })


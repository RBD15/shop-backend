const request = require('supertest');
const createApp = require('../../src/app');
const { models } = require('../../src/db/sequelize');
const { upSeed, downSeed} = require('../../src/utils/umzug');

describe('Test User Services', () =>{

  let app = null;
  let api = null;
  let server = null;

  beforeAll(async() => {
    app =createApp()
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  })

  describe(' GET /my-user', () => {
    let accessToken=null;
    let user=null;
    beforeAll(async() => {
      user = await models.User.findByPk(1);
      const inputData = {
        email: user.email,
        password: "12345678"
      }

      const response = await api.post('/api/v1/auth/login').send(inputData);
      accessToken = response.body.access_token;
    })

    test('should return a 401', async () => {

      const Authorization = `Bearer 123456`
      const response = await api.get('/api/v1/profile/my-user').send(Authorization);
      expect(response.statusCode).toEqual(401);
      expect(response.text).toEqual("Unauthorized");
    })

    test('should return a User', async () => {

      const {statusCode, body, headers} = await api.get('/api/v1/profile/my-user').set({'Authorization':`Bearer ${accessToken}`});
      expect(statusCode).toEqual(200);
      expect(headers['content-type']).toMatch('application/json');
      expect(body.email).toEqual(user.email);
      // expect(response.body).toEqual({
      //   statusCode: 401,
      //   error: 'Unauthorized',
      //   message: 'Unauthorized'
      // });
    })




    describe(' GET /my-orders', () => {

      test('should return a 401', async () => {

        const response = await api.get('/api/v1/profile/my-orders').set({'Authorization':`Bearer 123456fbasdfbzdfasdfs`});
        expect(response.statusCode).toEqual(401);
        expect(response.text).toEqual("Unauthorized");
      })

      // test('should return orders', async () => {

      //   const {statusCode, headers} = await api.get('/api/v1/profile/my-orders').set({'Authorization':`Bearer ${accessToken}`});
      //   expect(statusCode).toEqual(200);
      //   expect(headers['content-type']).toMatch('application/json');
      //   // expect(response.body).toEqual({
      //   //   statusCode: 401,
      //   //   error: 'Unauthorized',
      //   //   message: 'Unauthorized'
      //   // });
      // })
    });
  });

  afterAll(async() =>{
    await downSeed()
    server.close()
  })

  })


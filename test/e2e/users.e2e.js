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
    await upSeed();
  })


  describe(' POST /users', () => {
    let user=null;
    beforeAll( async() => {
      user = await models.User.findByPk(1);
    });

    test('should return a 400 Bad Request', async () => {
      const inputData = {
        email: "----",
        password: "----"
      }
      const response = await api.post('/api/v1/users').send(inputData);
      expect(response.statusCode).toEqual(400);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.body.error).toEqual("Bad Request");
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: '"email" must be a valid email. "password" length must be at least 8 characters long'
      });
    })

    test('should return a 400 Bad Request Bad Password', async () => {
      const inputData = {
          email: user.email,
          password: "----"
        }
        const response = await api.post('/api/v1/users').send(inputData);
        expect(response.statusCode).toEqual(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.error).toEqual("Bad Request");
        expect(response.body).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: '"password" length must be at least 8 characters long'
        });
      })


    test('should return a new User', async () => {
      const inputData = {
        email: "r1@correo.com",
        password: "123456789"
      }
      const {body,statusCode,headers} = await api.post('/api/v1/users').send(inputData);
      expect(statusCode).toEqual(201);
      expect(headers['content-type']).toMatch('application/json');

      const newUser = await models.User.findByPk(body.id)
      expect(body.email).toEqual(newUser.email);
      // expect(response.body).toEqual({
        //   statusCode: 400,
        //   error: 'Bad Request',
        //   message: '"email" is required. "password" is required'
        // });
      })

    });

      describe(' GET /users', () => {

        test('get a user /users/{id}', async () => {
          const id = 1;
          const user = await models.User.findByPk(id);
          const response = await api.get(`/api/v1/users/${id}`);
          expect(response.statusCode).toEqual(200);
          expect(response.headers['content-type']).toMatch('application/json');
          expect(response.body.id).toEqual(user.id);
          expect(response.body.email).toEqual(user.email);
        })

      });


      // describe(' DELETE /users', () => {
  //   test('DELETE /test', async () => {
  //     const response = await api.get('/test');
  //     expect(response.statusCode).toEqual(200);
  //     expect(response.body).toEqual({name:'Rober'});
  //     expect(response.headers['content-type']).toMatch('application/json');

  //   })
  // });\

  afterAll(async() =>{
    await downSeed();
    server.close()
  })

  })


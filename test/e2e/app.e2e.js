const request = require('supertest');
const createApp = require('../../src/app');
const { upSeed } = require('../../src/utils/umzug');

describe('tests for app', () =>{

  let app = null;
  let api = null;
  let server = null;

  beforeAll(async() => {

    app =createApp()

    app.get('/test', (req,res) => {
      res.status(200).json({name:'Rober'})
    });

    server = app.listen(9000);
    api = request(app);
  })


  test('GET /test', async () => {
    const response = await api.get('/test');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({name:'Rober'});
    expect(response.headers['content-type']).toMatch('application/json');
  })

  describe('Testing set headers value in /nueva-ruta', () => {
    test('should return 401 because of a bad api value ', async () => {
      const {statusCode, body, headers} = await api.get('/nueva-ruta').set({api:2324});
      expect(statusCode).toEqual(401);
      expect(headers['content-type']).toMatch('application/json');
      expect(body.error).toEqual('Unauthorized');

    })

    test('should return 200', async () => {
      const {statusCode, text } = await api.get('/nueva-ruta').set({api:process.env.API_KEY});
      expect(statusCode).toEqual(200);
      expect(text).toEqual('Hola, soy una nueva ruta');

    })
  })

  afterAll(() =>{
    server.close()
  })
})

const request = require('supertest');
const createApp = require('../../src/app');
const { upSeed, downSeed } = require('../../src/utils/umzug');
const {models} = require('../../src/db/sequelize');
describe('tests for Product', () =>{

  let app = null;
  let api = null;
  let server = null;

  beforeAll(async() => {

    app =createApp()
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  })

  describe('GET', () => {
    test('GET /products ALL Products', async () => {

      const product = await models.Product.findByPk(1);
      const response = await api.get('/api/v1/products/');
      expect(response.statusCode).toEqual(200);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.body.length).toEqual(3);
      expect(response.body[0].id).toEqual(product.id);
      expect(response.body[0].name).toEqual(product.name);
      expect(response.body[0].description).toEqual(product.description);
      expect(response.body[0].price).toEqual(product.price);
    })

    test('GET /products One Products', async () => {

      const product = await models.Product.findByPk(2);
      const response = await api.get(`/api/v1/products/${product.id}`);
      expect(response.statusCode).toEqual(200);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.body.length).toBeUndefined();
      expect(response.body.id).toEqual(product.id);
      expect(response.body.name).toEqual(product.name);
      expect(response.body.description).toEqual(product.description);
      expect(response.body.price).toEqual(product.price);
    })

    //TODO: Test pagination in product Services

    test('GET /products NOT FOUND', async () => {

      const response = await api.get(`/api/v1/products/100`);
      expect(response.statusCode).toEqual(404);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.body.error).toEqual('Not Found')
    })

  })

  describe('POST', () => {
    test('POST /products Create Product', async () => {

      const product = {
        name: "Nevera",
        price: 280,
        description: "Royal Fridge White",
        categoryId: 1,
        image: "https://api.lorem.space/image/game?w=150&h=220"
      }

      const response = await api.post('/api/v1/products/').send(product);
      expect(response.statusCode).toEqual(201);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.body.name).toEqual(product.name);
      expect(response.body.description).toEqual(product.description);
      expect(response.body.price).toEqual(product.price);
    })

    test('POST /products Bad Request', async () => {

      const product = {
        name: "Nevera",
        price: 280,
        description: "",
        categoryId: 1,
        image: "https://api.lorem.space/image/game?w=150&h=220"
      }

      const response = await api.post(`/api/v1/products/`).send(product);
      expect(response.statusCode).toEqual(400);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.body.error).toEqual('Bad Request')
    })

  })


  afterAll(async() =>{
    await downSeed();
    server.close()
  })
})

const { PRODUCT_TABLE } = require("../models/product.model");

module.exports = {
  up: async(queryInterface) => {
    if(queryInterface.context){
      queryInterface = queryInterface.context
    }
  return queryInterface.bulkInsert(PRODUCT_TABLE, [{
      name: "Nevera",
      price: 220,
      description: "Samsung Fridge",
      category_id: 1,
      image: "https://api.lorem.space/image/game?w=150&h=220",
      created_at: new Date(),
    },
    {
      name: "Cocina",
      price: 250,
      description: "Samsung Kitchen",
      category_id: 1,
      image: "https://api.lorem.space/image/game?w=150&h=220",
      created_at: new Date(),
    },
    {
      name: "TV",
      price: 350,
      description: "LG TV",
      category_id: 1,
      image: "https://api.lorem.space/image/game?w=150&h=220",
      created_at: new Date(),
    }
  ]);
  },
  down: (queryInterface) => {
    if(queryInterface.context){
      queryInterface = queryInterface.context
    }
    return queryInterface.bulkDelete(PRODUCT_TABLE, null, {});
  }
};

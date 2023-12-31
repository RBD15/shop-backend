const { USER_TABLE } = require("../models/user.model");
const bcrypt = require('bcrypt');

module.exports = {
  up: async(queryInterface) => {
    if(queryInterface.context){
      queryInterface = queryInterface.context
    }
    const password = '12345678'
    const hash = await bcrypt.hash(password,10);
    return queryInterface.bulkInsert(USER_TABLE, [{
      email:'r@correo.com',
      password:hash,
      role:'admin',
      created_at: new Date()
    }]);
  },
  down: (queryInterface) => {
    if(queryInterface.context){
      queryInterface = queryInterface.context
    }
    return queryInterface.bulkDelete(USER_TABLE, null, {});
  }
};

const sequelize = require('../db/sequelize')
const {models} = sequelize;
const bcrypt = require('bcrypt');

const upSeed = async () => {

  try {
    await sequelize.sync({force:true}); // up migrations
    const password = '12345678'
    const hash = await bcrypt.hash(password,10);
    await models.User.create({
      email:'r@correo.com',
      password:hash,
      role:'admin'
    });

    await models.Category.bulkCreate([
      {
        name: 'Electrodomesticos',
        image: 'https://api.lorem.space/image/game?w=150&h=220'
      },
      {
        name: 'Electronicos',
        image: 'https://api.lorem.space/image/game?w=150&h=220'
      }
    ])
  } catch (error) {
    console.error(error)
  }
}

const downSeed = async () => {

  await sequelize.drop(); // down migrations

}

module.exports = {upSeed,downSeed}
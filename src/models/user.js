'use strict';

const bcrypt = require('bcrypt');
const { ServerConfig } = require('../config');
const {
  Model
} = require('sequelize');
const serverConfig = require('../config/server-config');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len:[5,20]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(function encrypt(user){
    console.log('Before hashing the user object: ',user);
    const encryptedPassword = bcrypt.hashSync(user.password , +ServerConfig.SALT_ROUND);
    user.password = encryptedPassword;
    console.log('after hashing the user object: ',user);
  });

  return User;
};
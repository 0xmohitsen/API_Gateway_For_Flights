const CrudRepository = require('./crud-repository');
const { User } = require('../models');
const AppError = require('../utils/error/app-error');

class UserRepository extends CrudRepository{
    constructor(){
        super(User);
    }
}

module.exports = UserRepository;
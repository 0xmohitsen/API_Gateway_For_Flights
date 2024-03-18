const CrudRepository = require('./crud-repository');

const { User_Role } = require('../models');

class UserRoleRepository extends CrudRepository{
    constructor(){
        super(User_Role);
    }
}

module.exports = UserRoleRepository;
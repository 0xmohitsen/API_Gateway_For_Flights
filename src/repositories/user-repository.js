const CrudRepository = require('./crud-repository');
const { User } = require('../models');
const AppError = require('../utils/error/app-error');

class UserRepository extends CrudRepository{
    constructor(){
        super(User);
    }

    async getUserByEmail(email){
        const user = await User.findOne({
            where: {
                email : email
            }
        });
        return user;
    }
}

module.exports = UserRepository;
const { StatusCodes } = require('http-status-codes');
const { UserRepository } = require('../repositories');
const AppError = require('../utils/error/app-error');

const userRepo = new UserRepository();

async function signup(data){
    try{
        const response = await userRepo.create(data);
        return response;
    } catch(error){
        // console.log(error);
        if(error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError'){
            let explanation = [];
            error.errors.forEach((ele) => {
                explanation.push(ele.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    } 
}

module.exports = {
    signup
}
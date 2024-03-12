const { StatusCodes } = require('http-status-codes');
const { UserRepository, RoleRepository } = require('../repositories');
const AppError = require('../utils/error/app-error');
const { Auth } = require('../utils/common');
const { Enums } = require('../utils/common');

const userRepo = new UserRepository();
const roleRepo = new RoleRepository();

async function signup(data){
    try{
        const response = await userRepo.create(data);
        const role = await roleRepo.getRoleByName(Enums.ROLE_TYPES.CUSTOMER);
        response.addRole(role);
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

async function signin(data){
    try {
        const validUser = await userRepo.getUserByEmail(data.email);
        if(!validUser){
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }
        const checkPass = await Auth.checkPassword(data.password, validUser.password);
        if(!checkPass){
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
        }

        const jwt = await Auth.createToken({id: validUser.id, email: validUser.email});

        return jwt;
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token){
    try {
        console.log('I am in verifyToken service');
        if(!token){
            throw new AppError('JWT is missing', StatusCodes.BAD_REQUEST);
        }

        const response = Auth.verifyToken(token);
        
        const user = await userRepo.get(response.id);
        if(!user){
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }

        return user.id;
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        if(error.name === 'JsonWebTokenError'){
            throw new AppError('Invalid JWT token', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        if(error.name === 'TokenExpiredError'){
            throw new AppError('JWT token is expired', StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    signup,
    signin,
    isAuthenticated
}
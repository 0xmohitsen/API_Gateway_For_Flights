const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require('../utils/error/app-error');
const { UserService } = require('../services');

function validateUserRequest(req, res, next){
    if(!req.body.email){
        ErrorResponse.message = 'Something went wrong while creating user';

        ErrorResponse.error = new AppError(['Email is not found in the incoming request'], StatusCodes.BAD_REQUEST);

        return res 
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }

    if(!req.body.password){
        ErrorResponse.message = 'Something went wrong while creating user';

        ErrorResponse.error = new AppError(['Password is not found in the incoming request'], StatusCodes.BAD_REQUEST);

        return res 
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

async function checkAuth(req, res, next){
    try {
        const token = await UserService.isAuthenticated(req.headers['x-access-token']);
        if(token){
            req.user = token;
            next();
        }
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(error);
    }
}

async function isAdmin(req, res, next){
    const response = await UserService.isAdmin(req.user);
    console.log(response);
    if(!response){
        return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({message: 'Not authorized to perform this action'});
    }
    next();
}

async function isFlightCompany(req, res, next){
    const response = await UserService.isNotCustomer(req.user);
    if(!response){
        return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({message: 'Not authorized to perform this action'});
    }
    next();
}

module.exports = {
    validateUserRequest,
    checkAuth,
    isAdmin,
    isFlightCompany
}
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require('../utils/error/app-error');

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

module.exports = validateUserRequest;
const express = require('express');
const router = express.Router();

const { UserController } = require('../../controllers');
const { UserMiddlewares } = require('../../middlewares');

router
    .post('/signup', UserMiddlewares.validateUserRequest ,UserController.signup);

    router
    .post('/signin',UserMiddlewares.validateUserRequest ,UserController.signin);

module.exports = router;
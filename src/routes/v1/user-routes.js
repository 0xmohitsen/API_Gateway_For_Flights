const express = require('express');
const router = express.Router();

const { UserController } = require('../../controllers');
const { UserMiddlewares } = require('../../middlewares');

router
    .post('/signup', UserMiddlewares ,UserController.signup);

    router
    .post('/signin' ,UserController.signin);

module.exports = router;
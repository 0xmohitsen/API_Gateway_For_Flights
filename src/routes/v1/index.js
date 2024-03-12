const express = require('express');
const { InfoController } = require('../../controllers');
const userRoutes = require('./user-routes');
const { UserMiddlewares } = require('../../middlewares');

const router = express.Router();

router
    .get('/info', UserMiddlewares.checkAuth , InfoController);

router.use('/users', userRoutes);

module.exports = router;
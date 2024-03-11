const express = require('express');
const { InfoController } = require('../../controllers');
const userRoutes = require('./user-routes');

const router = express.Router();

router
    .get('/info', InfoController);

router.use('/users', userRoutes);

module.exports = router;
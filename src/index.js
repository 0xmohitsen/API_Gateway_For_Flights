const express = require('express');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const { rateLimit } = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { UserService } = require('./services');
const { UserMiddlewares } = require('./middlewares');

const app = express();

const authenticationAndAuthorization = [UserMiddlewares.checkAuth];

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 30, // Limit each IP to 2 requests per `window` (here, per 2 minutes).
})
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/flightsService', authenticationAndAuthorization, createProxyMiddleware({ target: ServerConfig.FLIGHT_SERVER , 
    changeOrigin: true, 
    pathRewrite: {'^/flightsService': '/'}
}));

app.use('/bookingService',authenticationAndAuthorization, createProxyMiddleware({ target: ServerConfig.BOOKING_SERVER , 
    changeOrigin: true , 
    pathRewrite: {
        '^/bookingService': '/'}
}));

async function isAdminOrFlightCompany(req, res, next){
    const response = await UserService.isAdmin(req.user);
    if(!response){
        UserMiddlewares.isFlightCompany(req, res, next);
    }
    next();
}

app.get('/home', (req, res) => {

    return res.json({message: 'Welcome to the Homepage'});
});

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Server is running at PORT:${ServerConfig.PORT}`);
})
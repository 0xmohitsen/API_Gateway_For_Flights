const express = require('express');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const { rateLimit } = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 10, // Limit each IP to 2 requests per `window` (here, per 2 minutes).
})
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/flightsService', createProxyMiddleware({ target: ServerConfig.FLIGHT_SERVER , 
    changeOrigin: true, 
    pathRewrite: {'^/flightsService': '/'} 
}));
app.use('/bookingService', createProxyMiddleware({ target: ServerConfig.BOOKING_SERVER , 
    changeOrigin: true , 
    pathRewrite: {
        '^/bookingService': '/'}
}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Server is running at PORT:${ServerConfig.PORT}`);
})
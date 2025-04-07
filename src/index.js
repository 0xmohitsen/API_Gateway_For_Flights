const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");
const { AuthRequestMiddlewares } = require("./middlewares/index");

const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");
const app = express();

// const db = require("./models/index");

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 30, // Limit each IP to 30 requests per `window` (here, per 2 minutes)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);
// console.log(ServerConfig.FLIGHT_SERVICE);
app.use(
  "/flightsService",
  createProxyMiddleware({
    onProxyReq: fixRequestBody,
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/flightsService": "" },
  })
);
app.use(
  "/bookingService",
  AuthRequestMiddlewares.checkAuth,
  createProxyMiddleware({
    onProxyReq: fixRequestBody,
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/bookingService": "",
    },
  })
);

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);

  // if (process.env.DB_SYNC) {
  //   db.sequelize.sync({ alter: true });
  // }
});

/**
 * user
 *  |
 *  v
 * localhost:3001 (API Gateway) localhost:4000/api/v1/bookings
 *  |
 *  v
 * localhost:3000/api/v1/flights
 */

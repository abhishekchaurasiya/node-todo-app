const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    APP_PORT,
    DB_URL,
    JWT_SCRET_KEY,
    Node_Env,
    FRONTEND_URL
} = process.env;
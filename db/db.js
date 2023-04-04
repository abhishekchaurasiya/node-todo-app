const mongoose = require("mongoose")
const { DB_URL } = require("../config/index")

const connectdb = () => {
    const db = mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    db.then(() => {
        console.log("Database is connected")
    }).catch(error => {
        console.log(error.message)
    })
    return db;
}

module.exports = { connectdb };

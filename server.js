const express = require("express");
const { connectdb } = require("./db/db")
const { APP_PORT, FRONTEND_URL } = require("./config/index");
const cors = require("cors")
const cookieParser = require("cookie-parser")
const userRouter = require("./router/routes")
const taskRouter = require("./router/task");
const { errorMiddleWare } = require("./middlewares/errorHandler");
const app = express();

// database connected
connectdb()

app.get("/", (req, res) => {
    res.send("Deploye the backend code in the server")
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: FRONTEND_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
}))



app.use("/api/v1/users", userRouter)
app.use("/api/v1/task", taskRouter)

app.use(errorMiddleWare)

const start = async () => {
    try {
        app.listen(APP_PORT, () => {
            console.log(`Server is running at port ${APP_PORT} in ${Node_Env} Mode`)
        })
    } catch (error) {
        console.log(error.message)
    }
};
start();
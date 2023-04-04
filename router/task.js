const express = require("express");
const { newTask, getMyTask, updateTask, deleteTask } = require("../controller/taskController");
const isAuthenticated = require("../middlewares/auth");
const router = express.Router();

router.post("/new-task", isAuthenticated, newTask);

router.get("/mytasks", isAuthenticated, getMyTask);

router
    .route("/:id")
    .put(isAuthenticated, updateTask)
    .delete(isAuthenticated, deleteTask)



module.exports = router;
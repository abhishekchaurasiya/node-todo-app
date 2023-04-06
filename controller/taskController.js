const Joi = require("joi");
const Task = require("../models/task");
let mongoose = require('mongoose');
const { ErrorHandler } = require("../middlewares/errorHandler");
let ObjectId = mongoose.Types.ObjectId;

// Create a New Task *************************************************
const newTask = async (req, res, next) => {
    // validation
    const taskSchema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(5).max(400).required()
    });
    // check validation error
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(401).json({ message: error.message })
    };

    const { title, description } = req.body;

    const task = new Task({
        title, description, user: req.user
    });

    try {
        await task.save();
    } catch (error) {
        next(error)
    }
    // send response 
    res.status(201).json({
        success: true,
        message: "Task added successfully",
        tasks: task
    })
};

// Get All Task *************************************************
const getMyTask = async (req, res, next) => {
    const userid = req.user._id;

    try {
        const tasks = await Task.find({ user: userid })

        if (tasks.length === 0) return res.status(404).json({ status: false, tasks: "Task not found!" })

        res.status(200).json({ status: true, tasks })
    } catch (error) {
        next(error)
    }
};

// Update Task with id *************************************************
const updateTask = async (req, res, next) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(404).json({ status: false, message: "User Id not valid!" })

    try {
        const tasks = await Task.findById(id)
        if (!tasks) return next(new ErrorHandler("Task not found!", 404))

        tasks.isCompleted = !tasks.isCompleted
        await tasks.save();
        res.status(200).json({ status: true, message: "Task Updated" })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};



// Delete Task *************************************************
const deleteTask = async (req, res, next) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return next(new ErrorHandler("User Id not valid!"))

    try {
        const tasks = await Task.findById(id)
        if (!tasks) return next(new ErrorHandler("This task hasbeen already deleted!", 404))

        await tasks.deleteOne();
        res.status(200).json({ status: true, message: "Task deleted " })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



module.exports = { newTask, getMyTask, updateTask, deleteTask }
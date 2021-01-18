const Todo = require("../../models/todo")
const User = require("../../models/user")
const mail = require("../../lib/mails")

module.exports = {
  async find(req, res) {
    try {
      const todos = await Todo.find({ _user: req.user._id })
        .select("-password -forgotpassword")
        .exec()
      return res.json({ error: false, todos })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  async get(req, res) {
    try {
      const todos = await Todo.findOne({ _user: req.user._id })
        .populate("_user", "-password -forgotpassword")
        .exec()
      return res.json({ error: false, todos })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  async post(req, res) {
    try {
      const { body } = req
      console.log(req.user)
      const todo = new Todo({
        text: body.text,
        status: body.status,
        complete: body.complete,
        _user: req.user._id,
      })
      const newTodo = await todo.save()
      //   const user = await User.findOne({ _id: req.user._id }).populate("_user", "-password -forgotpassword").exec()
      //   user._todos.push(newTodo)
      //   await user.save()

      try {
        await mail("todo-notification", {
          to: "",
          subjectt: "Todo Notification",
          locals: {
            userName: req.user.fullName,
            email: req.user.email,
            task: `1 Todo is added .`
          }
        })
      } catch (mailErr) {
        console.log("==> Mail sending Error: ", mailErr)
        throw new Error(
          "Failed to send Password Reset Email! Please Retry Later."
        )
      }

      return res.json({
        error: false,
        message: "Todo added",
        todo: newTodo,
        // todos: allTodos,
      })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  async put(req, res) {
    try {
      const { status, text, complete } = req.body
      const updateTodo = await Todo.findOne({ _id: req.params.id }).exec() //   || await User._todos.findOne({ _id: req.params.id }).exec()
      if (updateTodo === null) {
        return res
          .status(400)
          .json({ error: true, reason: "No such Todo-Data!" })
      }
      // const allTodos = await Todo.find();
      if (text !== undefined) updateTodo.text = text
      if (status !== undefined && typeof status === "boolean") {
        updateTodo.status = status
      }

      if (complete !== undefined && typeof complete === "boolean") {
        updateTodo.complete = complete
      }

      let updatedData = await updateTodo.save()
      updatedData = updatedData.toObject()
      try {
        await mail("todo-notification", {
          to: "",
          subjectt: "Todo Notification",
          locals: {
            userName: req.user.fullName,
            email: req.user.email,
            task: `1 Todo is updated .`
          }
        })
      } catch (mailErr) {
        console.log("==> Mail sending Error: ", mailErr)
        throw new Error(
          "Failed to send Password Reset Email! Please Retry Later."
        )
      }

      return res.json({
        error: false,
        message: "Todo updated",
        todo: updatedData,
        // todos: updatedData,
      })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  async delete(req, res) {
    try {
      await Todo.deleteOne({ _id: req.params.id }).exec()
      //   const user = await User.findOne({ _id: req.user._id }).populate("_user", "-password -forgotpassword").exec()
      //   user._todos.pop(req.params._id)
      //   await user.save()
      try {
        await mail("todo-notification", {
          to: "",
          subjectt: "Todo Notification",
          locals: {
            userName: req.user.fullName,
            email: req.user.email,
            task: `1 Todo is deleted .`
          }
        })
      } catch (mailErr) {
        console.log("==> Mail sending Error: ", mailErr)
        throw new Error(
          "Failed to send Password Reset Email! Please Retry Later."
        )
      }

      return res.json({
        error: false,
        message: "Todo deleted",
      })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
}

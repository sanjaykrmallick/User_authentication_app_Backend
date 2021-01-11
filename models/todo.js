const mongoose = require("mongoose")
const TodoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    complete: {
      type: Boolean,
      required: true,
      default: true,
    },
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

// TodoSchema.set("toJSON", { virtuals: true })
// TodoSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Todo", TodoSchema)

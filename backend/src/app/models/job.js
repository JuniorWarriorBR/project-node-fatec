const mongoose = require("../../database");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      require: true,
    },
  ],
  completed: {
    type: Boolean,
    require: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;

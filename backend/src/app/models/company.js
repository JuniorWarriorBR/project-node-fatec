const mongoose = require("../../database");

const CompanySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;

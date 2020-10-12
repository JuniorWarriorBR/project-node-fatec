const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/projeto-node", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.Promise = global.Promise;

module.exports = mongoose;

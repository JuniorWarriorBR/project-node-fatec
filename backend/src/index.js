const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

require("./app/controllers/index")(app);

app.listen(5000, () => console.log("Servidor rodando na porta 5000"));

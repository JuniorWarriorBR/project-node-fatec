const { schema } = require("../models/user");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

const User = require("../models/user");
const Job = require("../models/job");
const Company = require("../models/company");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: "Token faltando!" });

  const parts = authHeader.split(" ");
  if (!parts.length === 2)
    return res.status(401).send({ error: "Token falhou!" });

  const [schema, token] = parts;

  if (!/^Bearer$/i.test(schema))
    return res.status(401).send({ error: "Token incompleto!" });

  jwt.verify(token, authConfig.secret, async (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token inválido!" });
    req.userId = decoded.id;
    req.userAdmin = decoded.admin;
    // Verifica se existe um usuário mesmo com o Token válido
    const userId = await User.findOne({ _id: req.userId });
    if (!userId) return res.status(401).send({ error: "Token inválido!" });

    // Verifica se o id do job passado pertence ao Token informado
    if (req.baseUrl === "/jobs" && req.path !== "/") {
      jobId = req.path.replace("/", "");
      const job = await Job.findOne({ _id: jobId });
      if (!job) return res.status(400).send({ error: "Job não existe!" });
      if (job.assignedTo != req.userId)
        return res
          .status(400)
          .send({ error: "Você não tem autorização para alterar este job!" });
    }

    // Verifica se o id da empresa passada pertence ao Token informado
    if (req.baseUrl === "/companies" && req.path !== "/") {
      companyId = req.path.replace("/", "");
      const company = await Company.findOne({ _id: companyId });
      if (!company)
        return res.status(400).send({ error: "Empresa não existe!" });
      if (company.user != req.userId)
        return res.status(400).send({
          error: "Você não tem autorização para alterar esta empresa!",
        });
    }

    // Verifica se o id do usuario passado pertence ao Token informado
    // Libera para o Admin
    if (req.baseUrl === "/users" && req.path !== "/") {
      if (userId.admin) return next();
      userIdOnUrl = req.path.replace("/", "");
      const user = await User.findOne({ _id: userIdOnUrl });
      if (!user) return res.status(400).send({ error: "Usuário não existe!" });
      console.log(user);
      if (user.id != req.userId)
        return res.status(400).send({
          error: "Você não tem autorização para alterar este usuário!",
        });
    }

    return next();
  });
};

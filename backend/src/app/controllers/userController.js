const express = require("express");
const authMiddleware = require("../middlewares/auth");

const User = require("../models/user");
const Job = require("../models/job");
const Company = require("../models/company");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    if (!req.userAdmin) {
      let users = await User.find().where("_id").equals(req.userId);
      return res.send({ users, success: "Usuários listados com sucesso!" });
    } else {
      let users = await User.find();
      return res.send({ users, success: "Usuários listados com sucesso!" });
    }
  } catch (error) {
    return res.status(400).send({ error: "Erro ao carregar usuários!" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .where("_id")
      .equals(req.userId);

    return res.send({ user, success: "Usuário listado com sucesso!" });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao carregar usuário!" });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (name || email) {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        {
          name,
          email,
        },
        { new: true }
      );

      if (!password) {
        await user.save();
        return res.send({ user, success: "Usuario atualizado com sucesso!" });
      }
    }

    if (password) {
      const user = await User.findOne({ _id: req.params.userId });
      user.password = password;
      await user.save();
      return res.send({ success: "Senha atualizada com sucesso!" });
    }
  } catch (error) {
    return res.status(400).send({ error: "Erro ao atualizar usuário!" });
  }
});

router.put("/password/:userId", async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({ _id: req.userId });

    if (!user)
      return res.status(400).send({ error: "Usuário não encontrado!" });

    user.password = password;

    await user.save();

    return res.send({ success: "Senha atualizada com sucesso!" });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao atualizar Senha!" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const jobs = await Job.find().where("assignedTo").equals(req.params.userId);
    const companies = await Company.find()
      .where("user")
      .equals(req.params.userId);

    if (jobs) {
      await Promise.all(
        jobs.map(async (job) => {
          await Job.findByIdAndRemove(job._id);
        })
      );
    }

    if (companies) {
      await Promise.all(
        companies.map(async (company) => {
          await Company.findByIdAndRemove(company._id);
        })
      );
    }

    await User.findByIdAndRemove(req.params.userId);
    return res.send();
  } catch (error) {
    return res.status(400).send({ error: "Erro ao deletar usuario!" });
  }
});

module.exports = (app) => app.use("/users", router);

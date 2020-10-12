const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");

const authConfig = require("../../config/auth.json");

const User = require("../models/user");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: "Usuário já existe!" });

    const user = await User.create(req.body);

    user.password = undefined;

    res.send({
      user,
      token: generateToken({ id: user.id, admin: user.admin }),
      success: "Usuario cadastrado com sucesso!",
    });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao registrar" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return res.status(400).send({ error: "Usuário não encontrado!" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send({ error: "Senha inválida!" });

  user.password = undefined;

  res.send({
    user,
    token: generateToken({ id: user.id, admin: user.admin }),
    success: "Usuário autenticado com sucesso!",
  });
});

router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).send({ error: "Usuário não encontrado!" });

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    mailer.sendMail(
      {
        to: email,
        from: "junior@email.com",
        template: "auth/forgot_password",
        context: { token },
      },
      (error) => {
        if (error)
          return res.status(400).send({
            error: "Não foi possível enviar e-mail de recuperação de senha!",
          });

        return res.send({ success: "E-mail enviado com sucesso!" });
      }
    );
  } catch (error) {
    res
      .status(400)
      .send({ error: "Erro ao tentar recuperar senha, tente novamente!" });
  }
});

router.post("/reset_password", async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email }).select(
      "+passwordResetToken passwordResetExpires"
    );

    if (!user)
      return res.status(400).send({ error: "Usuário não encontrado!" });

    if (token !== user.passwordResetToken)
      return res
        .status(400)
        .send({ error: "Token inválido, solicite novamente!" });

    const now = new Date();

    if (now > user.passwordResetExpires)
      return res
        .status(400)
        .send({ error: "Token expirado, solicite novamente!" });

    user.password = password;
    user.passwordResetToken = "";
    user.passwordResetExpires = "";

    await user.save();

    res.send({ success: "Senha atualizada com sucesso!" });
  } catch (error) {
    res.status(400).send({ error: "Não foi possível atualizar a senha!" });
  }
});

module.exports = (app) => app.use("/auth", router);

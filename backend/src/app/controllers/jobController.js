const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Job = require("../models/job");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find()
      .where("assignedTo")
      .equals(req.userId)
      .populate(["company"]);

    return res.send({ jobs, success: "Jobs listados com sucesso!" });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao carregar Jobs!" });
  }
});

router.get("/:jobId", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .where("assignedTo")
      .equals(req.userId)
      .populate(["company"]);

    return res.send({ job, success: "Job listado com sucesso!" });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao carregar Job!" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, companyId } = req.body;
    const job = await Job.create({
      title,
      description,
      assignedTo: req.userId,
      company: companyId,
    });

    await job.save();

    return res.send({ job, success: "Job cadastrado com sucesso!" });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao criar novo Job!" });
  }
});

router.put("/:jobId", async (req, res) => {
  try {
    const { completed, title, description } = req.body;

    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      {
        completed,
        title,
        description,
      },
      { new: true }
    );

    await job.save();

    return res.send({ job, success: "Job atualizado com sucesso!" });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao atualizar Job!" });
  }
});

router.delete("/:jobId", async (req, res) => {
  try {
    await Job.findByIdAndRemove(req.params.jobId);
    return res.send({ success: "Job deletado com sucesso!" });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao deletar Job!" });
  }
});

module.exports = (app) => app.use("/jobs", router);

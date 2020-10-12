const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Company = require("../models/company");
const Job = require("../models/job");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const companies = await Company.find()
      .where("user")
      .equals(req.userId)
      .populate(["user"]);

    return res.send({ companies, success: "Empresas carregadas com sucesso!" });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao carregar empresas" });
  }
});

router.get("/:companyId", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId)
      .where("user")
      .equals(req.userId)
      .populate(["user"]);

    return res.send({ company, success: "Empresa carregada com sucesso!" });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao carregar empresa" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, jobs } = req.body;

    const company = await Company.create({
      title,
      description,
      user: req.userId,
    });

    if (jobs) {
      await Promise.all(
        jobs.map(async (job) => {
          const companyJob = new Job({
            ...job,
            assignedTo: req.userId,
            company: company._id,
          });
          await companyJob.save();
          company.job.push(companyJob);
        })
      );
    }

    await company.save();

    return res.send({ company, success: "Empresa cadastrada com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Erro ao criar empresa" });
  }
});

router.put("/:companyId", async (req, res) => {
  try {
    const { title, description, jobs } = req.body;

    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        title,
        description,
      },
      { new: true }
    );

    await company.save();

    return res.send({ company, success: "Empresa atualizada com sucesso!" });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao atualizar empresa!" });
  }
});

router.delete("/:companyId", async (req, res) => {
  try {
    const jobs = await Job.find().where("company").equals(req.params.companyId);

    if (jobs) {
      await Promise.all(
        jobs.map(async (job) => {
          await Job.findByIdAndRemove(job._id);
        })
      );
    }

    await Company.findByIdAndRemove(req.params.companyId);
    return res.send();
  } catch (error) {
    return res.status(400).send({ error: "Erro ao deletar empresa!" });
  }
});

module.exports = (app) => app.use("/companies", router);

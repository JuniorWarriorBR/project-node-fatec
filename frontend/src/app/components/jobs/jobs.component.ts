import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/models/job/job';
import { JobService } from 'src/app/services/job.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/models/empresa/empresa';


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  showModal = false;
  editing = false;
  job = {} as Job;
  jobs: Job[];
  empresas: Empresa[];

  constructor(
    private jobService: JobService,
    private empresaService: EmpresaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getJob();
    this.getEmpresa();
  }

  saveEnable(){
    if(this.empresas.length > 0){
      this.showModal = true
    }else{
      this.toastr.info('É necessário cadastrar uma empresa primeiro!');
    }
  }

  // defini se uma job será criada ou atualizada
  saveJob(form: NgForm) {
    if (this.job._id !== undefined) {
      this.jobService.updateJob(this.job).subscribe(() => {
        this.cleanForm(form);
        this.getJob();
        this.toastr.success('Job atualizado com sucesso!');
        this.editing = false;
        this.showModal = false;
      });
    } else {
      this.jobService.saveJob(this.job).subscribe(() => {
        this.cleanForm(form);
        this.getJob();
        this.toastr.success('Job cadastrado com sucesso!');
        this.showModal = false;
      });
    }
  }

  getJob() {
    this.jobService.getJob().subscribe((jobs: Job[]) => {
      this.jobs = jobs['jobs'];
    });
  }

  getEmpresa() {
    this.empresaService.getEmpresa().subscribe((empresas: Empresa[]) => {
      this.empresas = empresas['companies'];
    });
  }

  // deleta uma job
  deleteJob(job: Job) {
    if(confirm("Deseja realmente deletar o job "+job.title)) {
      this.jobService.deleteJob(job).subscribe(() => {
        this.getJob();
        this.toastr.success('Job excluido com sucesso!');
      });
    }
    
  }

  // Editar job
  editJob(job: Job) {
    this.job = { ...job, companyId: job.company[0]._id };
    this.editing = true;
    this.showModal = true;
  }

  // limpa o formulario
  cleanForm(form: NgForm) {
    this.getJob();
    form.resetForm();
    this.job = {} as Job;
  }

}

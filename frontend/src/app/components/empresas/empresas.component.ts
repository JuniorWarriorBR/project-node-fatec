import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/models/empresa/empresa';
import { EmpresaService } from 'src/app/services/empresa.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css'],
})
export class EmpresasComponent implements OnInit {
  showModal = false;
  empresa = {} as Empresa;
  empresas: Empresa[];

  constructor(
    private empresaService: EmpresaService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getEmpresa();
  }

  // defini se uma empresa será criada ou atualizada
  saveEmpresa(form: NgForm) {
    if (this.empresa._id !== undefined) {
      this.empresaService.updateEmpresa(this.empresa).subscribe(() => {
        this.cleanForm(form);
        this.getEmpresa();
        this.toastr.success('Empresa atualizada com sucesso!');
        this.showModal = false;
      });
    } else {
      this.empresaService.saveEmpresa(this.empresa).subscribe(() => {
        this.cleanForm(form);
        this.getEmpresa();
        this.toastr.success('Empresa cadastrada com sucesso!');
        this.showModal = false;
      });
    }
  }

  getEmpresa() {
    this.empresaService.getEmpresa().subscribe((empresas: Empresa[]) => {
      this.empresas = empresas['companies'];
    });
  }

  // deleta uma empresa
  deleteEmpresa(empresa: Empresa) {
    if(confirm("Deseja realmente deletar a empresa: "+empresa.title + " ? "+"  Todos os Jobs relacionados a ela serão excluídos!")) {
      this.empresaService.deleteEmpresa(empresa).subscribe(() => {
        this.getEmpresa();
        this.toastr.success('Empresa excluida com sucesso!');
      });
    }
    
  }

  // Editar empresa
  editEmpresa(empresa: Empresa) {
    this.empresa = { ...empresa };
    this.showModal = true;
  }

  // limpa o formulario
  cleanForm(form: NgForm) {
    this.getEmpresa();
    form.resetForm();
    this.empresa = {} as Empresa;
  }
}

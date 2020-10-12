import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuario = {} as Usuario;
  usuarios: Usuario[];

  constructor(
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.getUsuario();
  }

  // atualiza usuário
  saveUsuario(form: NgForm) {
    if (this.usuario._id !== undefined) {
      this.usuarioService.updateUsuario(this.usuario).subscribe(() => {
        this.cleanForm(form);
        this.getUsuario();
        this.toastr.success('Usuario atualizada com sucesso!');
        this.loginService.logout();
        this.router.navigate(['/login']);
      });
    } else {
      this.toastr.error('Ocorreu um erro ao atualizar o usuário');
    }
  }

  getUsuario() {
    this.usuarioService.getUsuario().subscribe((usuario: Usuario[]) => {
      this.usuario = usuario['users'];
      if(this.usuario)
        this.editUsuario(this.usuario[0]);
    });
  }

    // deleta uma usuario
    deleteUsuario(usuario: Usuario) {
      if(confirm("Deseja realmente deletar a usuario: "+usuario.name + " ? "+"  Todos os Jobs e Empresas relacionados a este usuário serão excluídos!")) {
        this.usuarioService.deleteUsuario(usuario).subscribe(() => {
          this.getUsuario();
          this.toastr.success('Usuario excluida com sucesso!');
        });
      }
      
    }
  
    // Editar usuario
    editUsuario(usuario: Usuario) {
      this.usuario = { ...usuario };
    }
  
    // limpa o formulario
    cleanForm(form: NgForm) {
      this.getUsuario();
      form.resetForm();
      this.usuario = {} as Usuario;
    }

}

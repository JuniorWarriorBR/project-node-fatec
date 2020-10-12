import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario/usuario';
import { RegistraUsuarioService } from 'src/app/services/registra-usuario.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'],
})
export class RegistrarComponent implements OnInit {
  usuario = {} as Usuario;

  constructor(
    private registraUsuarioService: RegistraUsuarioService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  // defini se uma usuario será criada ou atualizada
  saveUsuario(form: NgForm) {
    if (this.usuario._id !== undefined) {
      this.toastr.error('Erro ao registrar');
    } else {
      this.registraUsuarioService.saveUsuario(this.usuario).subscribe(
        (res) => {
          this.router.navigate(['/login']);
          this.toastr.success('Login realizado com sucesso!');
        },
        (err) => {
          console.log(err);
          this.toastr.error(err);
        }
      );
    }
  }
}

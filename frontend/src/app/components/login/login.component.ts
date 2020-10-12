import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/usuario/login';
import { LoginService } from 'src/app/services/login.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  login = {} as Login;
  email = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loggedIn()
  }

  loggedIn(){
    if (this.loginService.loggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  doLogin(form: NgForm) {
    this.loginService.login(this.login).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', res['user'].email);
        this.email = res['user'].email;
        this.router.navigate(['/dashboard']);
        this.toastr.success('Login realizado com sucesso!');
      },
      (err) => {
        this.toastr.error('Ocorreu um erro com o Login, tente novamente!');
      }
    );
  }
}

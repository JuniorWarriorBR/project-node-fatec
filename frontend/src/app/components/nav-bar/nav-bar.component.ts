import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  email = '';
  constructor(
    public loginService: LoginService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.email = this.loginService.getEmail();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngDoCheck() {
    this.email = this.loginService.getEmail();
  }

  logout() {
    this.email = '';
    this.toastr.info('Logout realizado com sucesso!');
  }
}

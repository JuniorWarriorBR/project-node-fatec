import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Usuario } from '../models/usuario/usuario';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RegistraUsuarioService {
  url = 'http://localhost:5000/auth/register';

  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
    }),
  };

  // Criar um usuario
  saveUsuario(usuario: Usuario): Observable<Usuario> {
    return this.httpClient
      .post<Usuario>(this.url, JSON.stringify(usuario), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = error.error.error;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}

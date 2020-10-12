import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Usuario } from '../models/usuario/usuario'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = 'http://localhost:5000/users';
  constructor(private httpClient: HttpClient) { }

  // Obtem todos os usuarios
  getUsuario(): Observable<Usuario[]> {
    return this.httpClient
      .get<Usuario[]>(this.url)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Atualiza um usuario
  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.httpClient
      .put<Usuario>(this.url + '/' + usuario._id, JSON.stringify(usuario))
      .pipe(retry(1), catchError(this.handleError));
  }

  // deleta um usuario
  deleteUsuario(usuario: Usuario) {
    return this.httpClient
      .delete<Usuario>(this.url + '/' + usuario._id)
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
      errorMessage =
        `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}

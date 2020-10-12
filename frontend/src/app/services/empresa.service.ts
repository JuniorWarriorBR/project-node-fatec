import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Empresa } from '../models/empresa/empresa';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  url = 'http://localhost:5000/companies';

  constructor(private httpClient: HttpClient) {}

  // Obtem todas empresas
  getEmpresa(): Observable<Empresa[]> {
    return this.httpClient
      .get<Empresa[]>(this.url)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Criar uma empresa
  saveEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.httpClient
      .post<Empresa>(this.url, JSON.stringify(empresa))
      .pipe(retry(2), catchError(this.handleError));
  }

  // Atualiza uma empresa
  updateEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.httpClient
      .put<Empresa>(this.url + '/' + empresa._id, JSON.stringify(empresa))
      .pipe(retry(1), catchError(this.handleError));
  }

  // deleta uma empresa
  deleteEmpresa(empresa: Empresa) {
    return this.httpClient
      .delete<Empresa>(this.url + '/' + empresa._id)
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

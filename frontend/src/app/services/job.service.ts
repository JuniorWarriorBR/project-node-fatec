import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Job } from '../models/job/job';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  url = 'http://localhost:5000/jobs';
  constructor(private httpClient: HttpClient) { }

    // Obtem todos os jobs
    getJob(): Observable<Job[]> {
      return this.httpClient
        .get<Job[]>(this.url)
        .pipe(retry(2), catchError(this.handleError));
    }
  
    // Criar uma job
    saveJob(job: Job): Observable<Job> {
      return this.httpClient
        .post<Job>(this.url, JSON.stringify(job))
        .pipe(retry(2), catchError(this.handleError));
    }
  
    // Atualiza uma job
    updateJob(job: Job): Observable<Job> {
      return this.httpClient
        .put<Job>(this.url + '/' + job._id, JSON.stringify(job))
        .pipe(retry(1), catchError(this.handleError));
    }
  
    // deleta uma job
    deleteJob(job: Job) {
      return this.httpClient
        .delete<Job>(this.url + '/' + job._id)
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

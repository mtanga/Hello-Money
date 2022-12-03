import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse,HttpEvent, HttpParams, HttpRequest, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MavianceService {
  connect : boolean = false;
  httpHeader = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'*',
      'Accept': 'application/json, text/plain',
      'Access-Control-Allow-Credentials': 'true',
    })
  };

  



  constructor(
    private http: HttpClient,
    private router : Router
    
    
    ) {     }


  login(data:any){
    let ll = environment.url+ "login";
    console.log(ll, data, this.httpHeader);
    return  this.http.post(ll, data, this.httpHeader);
  }


isConnected(){
  this.connect = !this.connect
}
  



  handleError(error: HttpErrorResponse) {
    // this.load.hideLoader();
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
     // this.presentToast(error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    //this.presentToast(error.status);
    // return an observable with a user-facing error message
      return throwError(
      'Something bad happened; please try again later.');
  };

//Get data
getData(url){
const headers = new HttpHeaders({
     // 'Authorization': 'Bearer '+token
    });
  let ll =environment.url+url;
  return this.http.get(ll,{'headers':headers}).pipe( 
    retry(2),
    catchError(this.handleError)
  );
}

//Get data
getDatas(url, data){
  const headers = new HttpHeaders({
       // 'Authorization': 'Bearer '+token
      });
    let ll =environment.url+url;
   console.log(ll, data, {'headers':headers});
    return this.http.post(ll, data, {'headers':headers}).pipe( 
      retry(2),
      catchError(this.handleError)
    );
  }

addData(url){
    //let token = localStorage.getItem('token');
   // console.log(token)
    const headers = new HttpHeaders({
      //'Authorization': 'Bearer '+token
    });
  let ll =environment.url+url;
 // console.log(ll, {'headers':headers});
  return this.http.post(ll, {'headers':headers});
}
}

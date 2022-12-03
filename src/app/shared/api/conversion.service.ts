import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {

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
    private router : Router,
    
    
    ) {    

     }





  conversionPair(base, target){
    const headers = new HttpHeaders({
      // 'Authorization': 'Bearer '+token
     });
    let url = environment.exchangerateUrl+"pair/"+base+"/"+target;
    console.log(url);
    return this.http.get(url,{'headers':headers}).pipe( 
      retry(2),
      catchError(this.handleError)
    );
  }


  getCurencies(){
    let url = environment.exchangerateUrl+"codes";
    console.log(url);
    return this.http.get(url).pipe( 
      retry(2),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    // this.load.hideLoader();
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      console.log("reeeeeeeee")

     // this.presentToast(error.error.message);
    } else {
      console.log("reeeeeeeee2")
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

}

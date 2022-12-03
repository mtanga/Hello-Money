import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { connected } from 'process';
import { Observable } from 'rxjs';
import { ProfileService } from '../data/profile.service';

//import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../data/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user: any = [];
  connected : boolean = false;
  
  constructor(
    public router: Router,
  ){ }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if(!JSON.parse(localStorage.getItem('user_data'))) {
        this.router.navigate(['login'])
      }
      return true;
  }
  
}

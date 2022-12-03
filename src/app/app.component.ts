import { Component } from '@angular/core';
// other imports...
import { TranslateService } from '@ngx-translate/core'; // add this
import { Router } from '@angular/router';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { map } from 'rxjs/operators';
import { timer } from 'rxjs';
import { MavianceService } from './shared/api/maviance.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
    language: string = this.translate.currentLang; // 2 
  timerSubscription: any;
  verify : any = {};
  update  : any = {};

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService, // add this
    private router: Router,
    private con : MavianceService,
  ) {
    this.initializeApp();
  }
  
  initializeApp() {
    let lang = localStorage.getItem('language_user');
    if (lang!=null || lang!=undefined){
        this.translate.setDefaultLang(lang); // add this
       
      }
      else{
        this.translate.setDefaultLang('en'); // add this
      }
     // this.set();
  }
  
/*   set(){
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getStatus();
    });
  } */

  getStatus(){
        let first = localStorage.getItem('primer');
        if (first==null || first==undefined){
            this.router.navigate(['/onboarding']);
          }
/*         else{
           this.router.navigate(['/login']);
            let connected = false;
              if(connected==false ){
                this.router.navigate(['/login']);
                connected = true;
              }
              else{
                  this.router.navigate(['/tabs/tab1']);
              }
        } */
            
      }

      async checkTransactions(){
        console.log("Je vérifie juste")
        let user  = JSON.parse(localStorage.getItem('user_data'));

        let Transactions = JSON.parse(localStorage.getItem('transactions_user'));
        if(Transactions!=null){
          Transactions.forEach(async element => {
            console.log("elt", element);
            let donnees4 = {
              ptn : element.ptn
            }
            this.verify  = await this.con.getDatas("verify", donnees4).toPromise();
            console.log("verifier", this.verify);
            if(this.verify.data.status == "SUCCESS"){
              let donnees = {
                ptn : this.verify.data.ptn,
                status : this.verify.data.status
              }
              this.update  = await this.con.getDatas("update_transaction", donnees).toPromise();
              console.log("upadate", this.update);
              this.delete(element);
            }
          });
        }

      }


  delete(items){
      var test = localStorage.getItem('transactions_user');
      let arr = JSON.parse(test);
      for (let i=0;i<arr.length;i++){
        if(arr[i].id==items.id){
          arr.splice(i, 1);
          let json = JSON.stringify(arr);
          localStorage.setItem('transactions_user', json); 
         
        }
    }
    return;

}
  
  
}

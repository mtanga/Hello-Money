import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  language: string = this.translateService.currentLang; // 2 
  texting: any = {};


  
  constructor(
    public loadingController: LoadingController,
    private translateService: TranslateService,
  ) { 
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
    console.log(data);
    this.texting = data;
   });
  }

  showHideAutoLoader() {
    
    this.loadingController.create({
   //   message: 'This Loader Will Auto Hide in 2 Seconds',
      duration: 2000
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed! after 2 Seconds', dis);
      });
    });

  }

    // Show the loader for infinite time
    showLoader() {

      this.loadingController.create({
        message: this.texting.loading
      }).then((res) => {
        res.present();
      });
  
    }
  
    // Hide the loader if already created otherwise return error
    hideLoader() {
      this.loadingController.dismiss().then((res) => {
        console.log('Loading dismissed!', res);
      }).catch((error) => {
        console.log('error', error);
      });
  
    }
}

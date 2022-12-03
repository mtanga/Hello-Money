import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MavianceService } from '../shared/api/maviance.service';
import { LoadingService } from '../shared/utils/loading.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.page.html',
  styleUrls: ['./guest.page.scss'],
})
export class GuestPage implements OnInit {
  language: string = this.translateService.currentLang; // 2 
  user : any = {};
  texting: any= {};

  constructor(
    private translateService: TranslateService,
    private con : MavianceService,
    public router: Router,
    public loading : LoadingService,
    private toastController : ToastController,
  ) { }

  ngOnInit() {
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }


  async resent(){
    this.loading.showLoader();
    let data = {
      email : localStorage.getItem('mail_user')
    }
    //console.log(data);
    this.user  = await this.con.getDatas("resent", data).toPromise();
   // console.log(this.user);
    this.loading.hideLoader();
    this.presentToast(this.texting.emailresent);

  }

  login(){
    this.router.navigate(['/login']);
  }



  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}

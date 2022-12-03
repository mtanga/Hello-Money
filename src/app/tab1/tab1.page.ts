import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1
import { Router } from '@angular/router';
import * as moment from 'moment';
import { registerLocaleData } from '@angular/common';
import localeES from "@angular/common/locales/es";
registerLocaleData(localeES, "es");
import { formatDate } from "@angular/common";
import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { MavianceService } from '../shared/api/maviance.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { LoadingService } from '../shared/utils/loading.service';

class Port {
  public id: string;
  public name: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  language: string = this.translateService.currentLang; // 2 
  transactions : any = [];
  user: any = {};
  texting: any = {};
  infos: any = [];



   constructor(
    public router: Router,
    private translateService: TranslateService,
    private con : MavianceService,
    private loading : LoadingService,
    private alertController : AlertController,
  ) {



  }
  ngOnInit(): void {
    //this.loading.showLoader();
   this.user = JSON.parse(localStorage.getItem('user_data'));
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
    this.getTransactions(this.user.id);
  }

  async getTransactions(id){
    let data = {
      user :id
    }
   // this.loading.hideLoader();
    this.transactions = await this.con.getDatas("get_transactions", data).toPromise();
    this.infos = this.transactions.data;
   // this.loading.hideLoader();
    console.log("Mes transactions", this.infos)

  }

  async showTransaction(info){
    this.alertController.create({
      header: this.texting.ytrans,
      message: "",
      inputs: [
        {
          name: "photo",
          type : "text",
          disabled : true,
          label:this.texting.amountd,
          value: this.texting.yousends+" "+this.format(info.transaction_amount)+" "+info.currency
        },
        {
          name: "we",
          type : "text",
          disabled : true,
          label:this.texting.fees,
          value: this.texting.heget+" "+this.format(info.amount_transfered)+" XAF"
        },
        {
          name: "ee",
          type : "text",
          disabled : true,
          label:this.texting.bamount,
          value: "Date : "+new Date(info.created_at).toLocaleString()
        },
        {
          name: "eee",
          type : "text",
          disabled : true,
          label: "Source",
          value: "Source : "+info.type
        },
        {
          name: "eeeeee",
          type : "text",
          disabled : true,
          label: "Source",
          value: this.texting.status+" : "+info.status
        },
      ],
      buttons: [
        {
          text: this.texting.close,
          handler: () => {
            console.log('I care about humanity');
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  notification(){
    this.router.navigate(['notifications']);
  }


  local(){
    this.router.navigate(['localt']);
  }

  euro(){
    this.router.navigate(['eurot']);
  }



  format(price){
    if(price!=undefined){
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }




}

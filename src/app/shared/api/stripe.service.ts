import { Injectable } from '@angular/core';
import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FunctionsService } from '../utils/functions.service';
import { LoadingService } from '../utils/loading.service';
import { MavianceService } from './maviance.service';
import { TransactionsService } from './transactions.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  stripe_key : string = 'pk_test_51LTLAbH25XYFzVi4sYhQi8sUYHvtdzkQ4L8ap3YLxNtcbAIyYzXSzTaOzjP2S95zEgFIvycKBOtV8WbYXeVNQ7ef00AoS8auPb';
  language: string = this.translateService.currentLang; // 2 
  constructor(
    private stripe : Stripe,
    private con : MavianceService,
    public utils : FunctionsService,
    private loading : LoadingService,
    private transactions : TransactionsService,
    private translateService: TranslateService,
    public loadingController: LoadingController,
    private toastController: ToastController,
  ) {
    this.stripe.setPublishableKey('my_publishable_key');
   }




  MakePayement(data){
    this.loading.showLoader();
    this.stripe.setPublishableKey('pk_test_51LTLAbH25XYFzVi4sYhQi8sUYHvtdzkQ4L8ap3YLxNtcbAIyYzXSzTaOzjP2S95zEgFIvycKBOtV8WbYXeVNQ7ef00AoS8auPb');
    this.stripe.createCardToken(data.card)
    .then(token => {
      console.log("your token is here", token);
      this.makePayment(token, data);
    })
    .catch(error =>{
      this.loading.hideLoader();
      console.error("Erreur de carte", error)
      console.error("Erruer de carte specific", error.message)
      this.presentToast(error);
      this.presentToast(error.message);
      //this.presentToast(this.texting.payeder+" : "+error.message);
    });
  }


  async  makePayment(token, donnees) {
    let payment = {
      token: token.id,
      price: donnees.transaction_amount,
      email : donnees.user.email,
      currency : donnees.currency
      }
      console.log("Mon objet", payment);
      this.con.getDatas("debit_card", payment).subscribe( async (data:any)=> {
        this.loading.hideLoader();
        console.log(data);
        console.log(data.status);
        if(data.status=="success"){
          this.transactions.SaveStripeTransaction(donnees, token);
        }
      }, (err) => {
        this.loading.hideLoader();
        this.presentToast(err.text);
        this.presentToast(err);
        console.log("erreur de paiement", err);
        console.log(err.text);
       
      });
/*       const { role, data } = await loading.onDidDismiss();
      console.log('Loading dismissed!'); */
 }

 async presentToast(message) {
  const toast = await this.toastController.create({
    message: message,
    duration: 3000
  });
  toast.present();
}


  makeCommand(token, donnees){


  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { ToastController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../utils/loading.service';
import { ConversionService } from './conversion.service';
import { MavianceService } from './maviance.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  language: string = this.translateService.currentLang; // 2 
  methodService: any;
  getService: any = {};
  postQuote: any = {};
  postCollect : any = {};
  verify : any = {};
  transaction : any = {};
  myCart: any = [];
  texting: any = {};
  mailto: any = {};
  constructor(
    public router: Router,
    private translateService: TranslateService,
    private con : MavianceService,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public loading : LoadingService
  ) { 


    this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }


  async MakeCashout(data){
    this.loading.showLoader();
    if(await this.con.getData("ping").toPromise()){
        console.log("passé")
        let donnees1 = {
          serviceid : data.serviceCashOut.id
        }
        this.getService  = await this.con.getDatas("get_cashout", donnees1).toPromise();
        console.log("le service ici", this.getService);
          if(this.getService.status=="success"){
            let donnees2 = {
              quotestd : this.getService.data.payItemId,
              amount : data.transaction_amount
            }
            this.postQuote  = await this.con.getDatas("post_quote", donnees2).toPromise();
            console.log("le post quote ici", this.postQuote);
            if(this.postQuote.status=="success"){
              let donnees3 = {
                quoteId: this.postQuote.data.quoteId,
                phone_number: data.user_number,
                email: data.user.email,
                user: data.user.displayName,
                address: "Mambanda Bonaberi" || data.user.address,
                service_number: data.service_number
              }
              //this.postCollect  = await this.con.getDatas("post_collect", donnees3).toPromise();
              console.log("le post collect ici", this.postCollect);
                try {
                  this.postCollect  = await this.con.getDatas("post_collect", donnees3).toPromise();
                  if(this.postCollect.status=="success"){
                    let donnees4 = {
                      ptn : this.postCollect.data.ptn
                    }
                    this.verify  = await this.con.getDatas("verify", donnees4).toPromise();
                    console.log("le verify ici", this.verify);
                    if(this.verify.status=="success"){
                      if(this.verify.data.satus == "SUCCESS"){
                        console.log("Trnasaction en cours Success", );
                        this.MakeCashinonSuccess(data, this.verify.data);
                      }
                      else{
                        console.log("Trnasaction encours En cours");
                        var test = localStorage.getItem('transactions_user');
                        let arr = JSON.parse(test);
                        if(arr==null){
                          this.myCart.push(this.verify.data);
                          let json = JSON.stringify(this.myCart);
                          localStorage.setItem('transactions_user', json);
                        }
                        else{
                          arr.push(this.verify.data);
                          let json = JSON.stringify(arr);
                          localStorage.setItem('transactions_user', json);
                        }
                        this.loading.hideLoader();
                        this.SaveCashOutTransaction(data, this.verify.data);
                      }
                    }
                    else{
                      this.loading.hideLoader();
                    }
    
                  }
                  else{
                    console.log("33Trnasaction echouée..........");
                    this.loading.hideLoader();
                  }
                } catch (err) {
                  this.loading.hideLoader();
                   console.log("erreur", err);
                   this.router.navigate(['/solde'], { queryParams: {
                    message: err
                     }
                   });
                }

            }
            else{
              this.loading.hideLoader();
            }
            
          }
          else{
            this.loading.hideLoader();
          } 

    }
    else{
        console.log("API indisponible")
        this.loading.hideLoader();
    }
  }

  async MakeCashinonSuccess(data, donnees){
    if(await this.con.getData("ping").toPromise()){
        console.log("passé")
        let donnees1 = {
          serviceid : data.serviceCashIn
        }
        this.getService  = await this.con.getDatas("get_cashin", donnees1).toPromise();
        console.log("le service ici", this.getService);
          if(this.getService.status=="success"){
            let donnees2 = {
              quotestd : this.getService.data.payItemId,
              amount : data.amount_transfered
            }
            this.postQuote  = await this.con.getDatas("post_quote", donnees2).toPromise();
            console.log("le post quote ici", this.postQuote);
            if(this.postQuote.status=="success"){
              let donnees3 = {
                quoteId: this.postQuote.data.quoteId,
                phone_number: data.receiver_number,
                email: data.user.email || "micheltanga0@gmail.com",
                user: data.user.displayName || "Devert",
                address: data.user.address || "Mambanda Bonaberi",
                service_number: data.service_number
                //trid: Math.floor(100000000 + Math.random() * 900000000)
              }
              this.postCollect  = await this.con.getDatas("post_collect", donnees3).toPromise();
              console.log("le post collect ici", this.postCollect);
              if(this.postCollect.status=="success"){
                let donnees4 = {
                  ptn : this.postCollect.data.ptn
                }
                this.verify  = await this.con.getDatas("verify", donnees4).toPromise();
                console.log("le verify ici", this.verify);
                if(this.verify.status=="success"){
                  if(this.verify.data.satus == "SUCCESS"){
                    console.log("Success");
                    this.redirect(this.texting.inWay);
                    



                  }
                  else{
                    console.log("En cours");
                    
                  }

                }
                else{

                }

              }
              else{

              }
            }
            else{

            }
            
          }
          else{

          } 

    }
    else{
        console.log("API indisponible")
    }

  }

  async SaveCashOutTransaction(data, verify){
    this.loading.showLoader();
    let transaction = {
      'payment_method' : verify.merchant,
      'user_id': data.user.id,
      'user_name': data.user.displayName,
      'transaction_amount': data.transaction_amount,
      'type': "Debit",
      'status': verify.status,
      'transaction_number': verify.trid,
      'transaction_comission': data.transaction_comission,
      'amount_transfered': data.amount_transfered,
      'notes': "RAS",
      'currency': verify.systemCur,
      'user_number' : data.user_number,
      'receiver_number':data.user_number,
      'receiver_name': data.receiver_name
    }
    let message = this.texting.inWay;
    this.transaction  = await this.con.getDatas("save_transaction", transaction).toPromise();
    let mailData = {
      email : data.user.email,
      phone : data.user.phone,
      type : "Debit",
      name : data.user.displayName,
      sender_price : data.transaction_amount+" "+verify.systemCur,
      received_price : data.amount_transfered+" "+verify.systemCur,
      transaction_number: verify.trid,
      merchant: verify.merchant,
      status : verify.status,
    }
    this.mailto  = await this.con.getDatas("mailto", mailData).toPromise();
    console.log("transaction", this.transaction);
    this.loading.hideLoader();

    this.MakeCashin(data);
/*     this.router.navigate(['/solde'], { queryParams: {
      message: message
       }
     }); */
  }

  async MakeCashin(data){
    this.loading.showLoader();
    if(await this.con.getData("ping").toPromise()){
        console.log("passé")
        let donnees1 = {
          serviceid : data.serviceCashIn.id
        }
        this.getService  = await this.con.getDatas("get_cashin", donnees1).toPromise();
        console.log("le service ici", this.getService);
          if(this.getService.status=="success"){
            let donnees2 = {
              quotestd : this.getService.data.payItemId,
              amount : data.amount_transfered
            }
            this.postQuote  = await this.con.getDatas("post_quote", donnees2).toPromise();
            console.log("le post quote ici", this.postQuote);
            if(this.postQuote.status=="success"){
              let donnees3 = {
                quoteId: this.postQuote.data.quoteId,
                phone_number: data.receiver_number,
                email: data.user.email,
                user: data.user.displayName,
                address: data.user.address || "Mambanda Bonaberi",
                service_number: data.receiver_number
                //trid: Math.floor(100000000 + Math.random() * 900000000)
              }
              this.postCollect  = await this.con.getDatas("post_collect", donnees3).toPromise();
              console.log("le post collect ici", this.postCollect);
              if(this.postCollect.status=="success"){
                
                this.loading.hideLoader();
                this.saveCashin(data, this.postCollect.data);


              }
              else{
                this.loading.hideLoader();
              }
            }
            else{
              this.loading.hideLoader();
            }
            
          }
          else{
            this.loading.hideLoader();
          } 

    }
    else{
        console.log("API indisponible")
    }

  }


  async saveCashin(data, verify){
    this.loading.showLoader();
    let transaction = {
      'payment_method' : data.serviceCashIn.name,
      'user_id': data.user.id,
      'user_name': data.user.displayName,
      'transaction_amount': data.transaction_amount,
      'type': "Credit",
      'status': verify.status,
      'transaction_number': verify.trid,
      'transaction_comission': data.transaction_comission,
      'amount_transfered': data.amount_transfered,
      'notes': "RAS",
      'currency': verify.systemCur,
      'user_number' : data.receiver_number,
      'receiver_number':data.receiver_number,
      'receiver_name': data.receiver_name
    }
    this.transaction  = await this.con.getDatas("save_transaction", transaction).toPromise();
    console.log("transaction", this.transaction);
    let mailData = {
      email : data.user.email,
      phone : data.user.phone,
      type : "Credit",
      status :verify.status,
      name : data.user.displayName,
      sender_price : data.transaction_amount+" "+verify.systemCur,
      received_price : data.amount_transfered+" "+verify.systemCur,
      transaction_number: verify.trid,
      merchant: data.serviceCashIn.name,
    }
    this.mailto  = await this.con.getDatas("mailto", mailData).toPromise();
    this.loading.hideLoader();
    let message = this.texting.inWay;
    this.router.navigate(['/solde'], { queryParams: {
      message: message
       }
     });
  
}


  async SaveStripeTransaction(data, token){
    this.loading.showLoader();
    let transaction = {
      'payment_method' : "Bank card",
      //'service' : data.serviceCashIn,
      'user_id': data.user.id,
      //'user':data.user,
      'user_name': data.user.displayName,
      'transaction_amount': data.transaction_amount,
      'type': "DebitCard",
      'status': "SUCCESS",
      'transaction_number': token.id,
      'transaction_comission': data.transaction_comission,
      'amount_transfered': data.amount_transfered,
      'notes': "mtn",
      'user_number' : data.receiver_number,
      'receiver_number':data.receiver_number,
      'receiver_name': "ND",
      'currency' : data.currency
    }
    this.transaction  = await this.con.getDatas("save_transaction", transaction).toPromise();
    console.log("transaction", this.transaction);
    this.loading.hideLoader();
    this.presentToast(this.texting.stripeOK);
    this.cerditCustomer(data, token);
  }



  async cerditCustomer(data, token){
    this.loading.showLoader();
    if(await this.con.getData("ping").toPromise()){
        console.log("passé")
        let donnees1 = {
          serviceid : data.service
        }
        this.getService  = await this.con.getDatas("get_cashin", donnees1).toPromise();
        console.log("le service ici", this.getService);
          if(this.getService.status=="success"){
            let donnees2 = {
              quotestd : this.getService.data.payItemId,
              amount : data.amount_transfered
            }
            this.postQuote  = await this.con.getDatas("post_quote", donnees2).toPromise();
            console.log("le post quote ici", this.postQuote);
            if(this.postQuote.status=="success"){
              let donnees3 = {
                quoteId: this.postQuote.data.quoteId,
                phone_number: data.receiver_number,
                email: data.user.email,
                user: data.user.displayName,
                address: data.user.address || "Makepe Belavie",
                service_number: data.service_number
                //trid: Math.floor(100000000 + Math.random() * 900000000)
              }
              this.postCollect  = await this.con.getDatas("post_collect", donnees3).toPromise();
              console.log("le post collect ici", this.postCollect);
              if(this.postCollect.status=="success"){
                let donnees4 = {
                  ptn : this.postCollect.data.ptn
                }
                this.verify  = await this.con.getDatas("verify", donnees4).toPromise();
                console.log("le verify ici", this.verify);
                if(this.verify.status=="success"){
                  this.loading.hideLoader();
                  this.SaveCashInTransaction(data, this.verify.data);
                }
                else{
                  this.loading.hideLoader();
                }

              }
              else{
                this.loading.hideLoader();
              }
            }
            else{
              this.loading.hideLoader();
            }
            
          }
          else{
            this.loading.hideLoader();
          } 

    }
    else{
        console.log("API indisponible")
        this.loading.hideLoader();
    }

  }


  async SaveCashInTransaction(data, verify){
    this.loading.showLoader();
    let transaction = {
      'payment_method' : data.serviceCashIn.name,
      'user_id': data.user.id,
      'user_name': data.user.displayName,
      'transaction_amount': data.transaction_amount,
      'type': "Credit",
      'status': verify.status,
      'transaction_number': verify.ptn,
      'transaction_comission': data.transaction_comission,
      'amount_transfered': data.amount_transfered,
      'notes': "RAS",
      'currency': verify.systemCur,
      'user_number' : data.user_number,
      'receiver_number':data.service_number,
      'receiver_name': data.receiver_name
    }
    console.log("ma transaction", transaction);
    let message = this.texting.inWay;
    this.transaction  = await this.con.getDatas("save_transaction", transaction).toPromise();
    console.log("transaction", this.transaction);
    this.loading.hideLoader();
    //this.loading.hideLoader();
    this.router.navigate(['/solde'], { queryParams: {
      message: message
       }
     });
  }




  redirect(message){
    this.loading.hideLoader(); 
    this.router.navigate(['/solde'], { queryParams: {
      message: message
       }
     });
  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}

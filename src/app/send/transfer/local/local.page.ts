import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1
import { Router } from '@angular/router';
import { ConversionService } from '../../../shared/api/conversion.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import * as moment from 'moment';
import { registerLocaleData } from '@angular/common';
import localeES from "@angular/common/locales/es";
registerLocaleData(localeES, "es");
import { formatDate } from "@angular/common";
import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { MavianceService } from '../../../shared/api/maviance.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { FunctionsService } from 'src/app/shared/utils/functions.service';
import { TransactionsService } from 'src/app/shared/api/transactions.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { LoadingService } from 'src/app/shared/utils/loading.service';

class Port {
  public id: string;
  public name: string;
}

@Component({
  selector: 'app-local',
  templateUrl: './local.page.html',
  styleUrls: ['./local.page.scss'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class LocalPage implements OnInit {
  language: string = this.translateService.currentLang; // 2 
  texting : any = {};
  currencies: any;



  isLinear = true;
  interests = [];

  formGroup = new FormGroup({ secondCtrl: new FormControl(''), })



  amountConverted :number = 0;

  portsb: Port[] = [];
  portsc: Port[] = [];
  
  portb: Port;
  portc: Port;
  deviseb: any;
  method: any;
  methods: any;
  devisec: any;
  card_number : any;
  dateText :  any;
  card_code :  any;



  showed : boolean = false;
  step3 : boolean = false;
  step4 : boolean = false;
  user: any;
  phonetext : any;
  phoneNumber : any;
  phoneNumbers : any;
  country : any;
  amount: any;

  currency : string = 'CAD';
  stripe_key : string = 'pk_test_51LTLAbH25XYFzVi4sYhQi8sUYHvtdzkQ4L8ap3YLxNtcbAIyYzXSzTaOzjP2S95zEgFIvycKBOtV8WbYXeVNQ7ef00AoS8auPb';
  cardDetails : any = { };



  services : any = [
    {
        name : "MTN MoMo",
        id : "20053",
        regex : /^(237|00237|\\+237)?(?!650110360|671927008|672515252|672514557)((650|651|652|653|654|680|681|682|683|684|685|686|687|688|689)[0-9]{6}$|(67[0-9]{7})$)/
    },
    {
      name : "Orange Money",
      id : "50053",
      regex : /^(237)?((655|656|657|658|659)[0-9]{6}$|(69[0-9]{7})$)/
    },
    {
      name : "Express Union Mobile",
      id : "50053",
      regex : /^\\+?[1-9]\\d{1,14}$/
    },
    {
      name : "Yoomee Money",
      id : "50053",
      regex : /^(237)?(24)[0-9]{7}$/
    }

]


cashInServices : any = [
  {
      name : "MTN MoMo",
      id : "20052",
      regex : /^(237|00237|\\+237)?(?!650110360|671927008|672515252|672514557)((650|651|652|653|654|680|681|682|683|684|685|686|687|688|689)[0-9]{6}$|(67[0-9]{7})$)/
  },
  {
    name : "Orange Money",
    id : "50052",
    regex : /^(237)?((655|656|657|658|659)[0-9]{6}$|(69[0-9]{7})$)/
  },
  {
    name : "Express Union Mobile",
    id : "30001",
    regex : /^\\+?[1-9]\\d{1,14}$/
  },
  {
    name : "Yoomee Money",
    id : "100237",
    regex : /^(237)?(24)[0-9]{7}$/
  }

]

timeLeft: number = 60;
interval;
subscribeTimer: any;

  methodService: any;
  warningPhone: any = "";
  warningPhone1: any = "";
  settings: any = [];
  comission: any;
  donnee: any;
  methodServices: any;
  contactName: string;
  contactNumber: any;

  receiverNumber : any;
  hitCodeDiv: boolean = false;

  
  getService: any = {};
  postQuote: any = {};
  postCollect : any = {};
  verify : any = {};
  sec: any;
  dataTransaction: { serviceCashOut: any; serviceCashIn: any; transaction_amount: number; type: string; status: string; transaction_number: string; transaction_comission: number; amount_transfered: number; notes: string; service_number: any; user: any; user_number: any; receiver_number: any; receiver_name: string; };

   constructor(
    public router: Router,
    private translateService: TranslateService,
    private conversionService : ConversionService,
    private stripe : Stripe,
    public loading : LoadingService,
    private con : MavianceService,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public utils : FunctionsService,
    private transactions : TransactionsService,
    private contacts: Contacts,
    private alertController : AlertController,
    private alertCtrl: AlertController
  ) {

     this.stripe.setPublishableKey('my_publishable_key');
     this.conversionService.getCurencies().subscribe( async (da:any)=>{
      this.currencies = da.supported_codes;
      console.log("données", da);
      this.currencies.forEach(element => {
       
       let data = {
        id : element[0],
        name : element[1]
        };
        this.portsb.push(data); 
        this.portsc.push(data); 
      });
        //console.log(this.ports)
    })


  }

  ngOnInit() {
    this.interests = [
      { value: 'reading', viewValue: 'Reading' },
      { value: 'swimming', viewValue: 'Swimming' },
      { value: 'cycling', viewValue: 'Cycling' }
    ];
    
    this.user = JSON.parse(localStorage.getItem('user_data'));
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
    console.log(data);
    this.texting = data;
   });
}

  getContactPhoneNumbersList(phoneNumbers) {
    let mobileString = '';
    phoneNumbers.forEach((number) => {
        if (mobileString) mobileString += ' | ';
        mobileString += number.value;
    });
  }


pickContact(){
  this.contacts.pickContact().then((contact)=>{
  console.log("Selected contacts: "+ JSON.stringify(contact));
 // alert(JSON.stringify(contact));
  this.contactName = contact.displayName; 
 // alert(this.contactName);
  this.contactNumber = contact.phoneNumbers[0].value; 
 // alert(this.contactNumber);
  this.presentConfirm(contact.phoneNumbers);
});
}

async presentConfirm(phones) {

  // Object with options used to create the alert
  var options = {
    title: this.texting.chooseNumber,
    message: this.texting.ewnumber,
    buttons: [
      {
        text: this.texting.Cancel,
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: this.texting.Validate,
        handler: data => {
         // console.log("phone ici", data.phone);
          console.log("phone ici 2", data);
          this.receiverNumber = data;
        }
      }
    ],
    inputs : []
  };

  options.inputs = [];

  // Now we add the radio buttons
  for(let i=0; i< phones.length; i++) {
    options.inputs.push({ name : 'phone', value: phones[i].value, label: phones[i].value, type: 'radio' });
  }

  // Create the alert with the options
  //let alert = this.alertCtrl.create(options);
  this.alertController.create(options).then(res => {
    res.present();
  });
}


async selectNumber(phones){
   this.alertController.create({
     header: this.texting.profileImage,
     message: this.texting.profileImagedescription,
     inputs: [
       {
         name: "photo",
         type : "checkbox",
         label:this.texting.chooseL,
         value: "galery"
       },
       {
         name: "photo",
         type : "checkbox",
         label:this.texting.takeP,
         value: "take"
       },
     ],
     buttons: [
       {
         text: this.texting.Cancel,
         handler: () => {
           console.log('I care about humanity');
         }
       },
       {
         text: this.texting.Validate,
         handler: (data) => {

          



         }
       }
     ]
   }).then(res => {
     res.present();
   });
 }




  cardStatus(){
    let valt = 0;
    if(this.card_number){
      if(this.card_number.toString().length == 16 ){
         valt = valt + 1;
      }
     }
    if(this.dateText !=null || this.dateText==""){
      valt = valt + 1;
    }
    if(this.card_code !=null || this.card_code==""){
      if(this.card_code.toString().length == 3 ){
        valt = valt + 1;
     }
      //valt = valt + 1;
   }

    console.log(valt)
    return valt;
 }


 annee(date) {
  return  moment(date).format('YYYY'); // 2019-04-22
}

mois(date) {
  return  moment(date).format('MM'); // 2019-04-22
}

  onChange(value){
    //console.log("value", value.detail.value)
   // console.log("methods", this.methods)
    this.methodService = this.services.find((service) => service.id == value.detail.value);
    console.log("service", this.methodService);
  }

  onChanges(value){
    //console.log("value", value.detail.value)
   // console.log("methods", this.methods)
    this.methodServices = this.cashInServices.find((service) => service.id == value.detail.value);
    console.log("service", this.methodServices);
  }


  pay(){
    let mois = this.mois(this.dateText);
    let annee = this.annee(this.dateText);

    console.log(annee);

    console.log(mois);

    this.stripe.setPublishableKey(this.stripe_key);
  
    this.cardDetails = {
      number: this.card_number,
      expMonth: mois,
      expYear: annee,
      cvc: this.card_code
    }
  
    this.stripe.createCardToken(this.cardDetails)
      .then(token => {
        console.log(token);
       // this.makePayment(token.id);
      })
      .catch(error => console.error(error));
  
  }

  format(price){
    if(price!=undefined){
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }

  portChangeb(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.deviseb = event.value;
    console.log('portb:', event.value);
  }

  getPrice(value){
    if(this.tesNumber(value)==false){
      this.amount = value.slice(0, -1)
    }
  }

  removeLastCharacter(str){
    return str.substring(0, str.length - 1);
  }

  allLetter(inputtxt){
    var letters = /^[A-Za-z]+$/;
    if(inputtxt.match(letters))
      {
       return true;
      }
    else
      {
      return false;
      }
   }

   numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      console.log("result", false)
      return false;
      //console.log("result", false)
    }
    console.log("result", true)
    return true;
    console.log("result", true)

  }


  tesNumber(number){
    if(!/^[0-9]+$/.test(number)){
      return false;
    }
    else{
      return true;
    }
  }


  portChangec(event: {
    component: IonicSelectableComponent,
    value: any
   }) {
    console.log('portc:', event.value);
    this.devisec = event.value;
  }




  sendStatus(){
  //   console.log(this.phoneNumber);
     let valR = 0;
     if(this.country !=null || this.country==""){
       valR = valR + 1;
     }
     if(this.amount !=null || this.amount==""){
      valR = valR + 1;
    }
    if(this.method !=null || this.method==""){
      valR = valR + 1;
    }
     if(this.phoneNumber){
     // console.log(this.phoneNumber.nationalNumber)
      if(this.phoneNumber.nationalNumber.length == 13 ){
         valR = valR + 1;
         if(this.utils.checkMtnPhone(this.phoneNumber.internationalNumber, this.methodService.regex)==true){
          valR = valR + 1;
          this.warningPhone1 = ""
        }
        else{
          this.warningPhone1 = this.texting.warningPhone;
        }
      }
     }
     //console.log("somme", valR)
     return valR;
  }


  sendStatuss(){
    let valR = 0;
   if(this.methods !=null || this.methods==""){
     valR = valR + 1;
   }
  if(this.phoneNumbers){
     // console.log("m phone", this.phoneNumbers)
     if(this.phoneNumbers.nationalNumber.length == 13 ){
        valR = valR + 1;
       // console.log("phpm", this.utils.checkMtnPhone(this.phoneNumbers.internationalNumber, this.methodService.regex))
        if(this.utils.checkMtnPhone(this.phoneNumbers.internationalNumber, this.methodServices.regex)==true){
          valR = valR + 1;
          this.warningPhone = ""
        }
        else{
          this.warningPhone = this.texting.warningPhone;
        }
        //this.utils.checkMtnPhone(this.phoneNumbers.internationalNumber, "");
     }
    }
    if(this.receiverNumber){
      console.log("Mon numero bon", this.receiverNumber);
      console.log("Mon numero bon longueur ", this.receiverNumber.length);
      if(this.receiverNumber?.length == 18){
        valR = valR + 1;
        if(this.utils.checkMtnPhone(this.receiverNumber, this.methodServices.regex)==true){
          valR = valR + 1;
          this.warningPhone = ""
        }
        else{
          this.warningPhone = this.texting.warningPhone;
        }
      }
    }

    //console.log("somme", valR)
   
    return valR;
 }

  notification(){
    console.log("");
  }



  convert(){
   // console.log(this.deviseb)
     this.conversionService.conversionPair(this.deviseb.id, this.devisec.id).subscribe( async (da:any)=>{
      console.log(da)
      this.currencies = da;
      this.showed = true;
    }) 
  }

  sendNow (){
     this.showed = true;
     this.conversionService.conversionPair(this.country, "XAF").subscribe( async (da:any)=>{
      console.log(da)
      this.currencies = da;
      this.amountConverted = this.currencies.conversion_rate * this. amount;
      //this.showed = true;
    }) 
  }


  async sendNows (){
    this.loading.showLoader();
    this.settings  = await this.con.getData("get_settings").toPromise();
    let donnee = this.settings.data.find((setting) => setting.meta_name == "comission");
    this.donnee = donnee.value;
    this.comission = 0
    this.comission = (this.donnee*parseInt(this.amount))/100;
    console.log(this.comission);
    this.showed = true;
    this.conversionService.conversionPair(this.country, "XAF").subscribe( async (da:any)=>{
     console.log(da)
     this.currencies = da;
     this.amountConverted = this.currencies.conversion_rate * this. amount;
     this.loading.hideLoader();
   }) 
 }

 async sendConfirm(){
    this.dataTransaction = {
      'serviceCashOut' : this.services.find((service) => service.id == this.method),
      'serviceCashIn' : this.cashInServices.find((service) => service.id == this.methods),
      'transaction_amount': parseInt(this.amount),
      'type': "Retrait",
      'status': "PENDING",
      'transaction_number': "0",
      'transaction_comission': parseInt(this.donnee),
      'amount_transfered': parseInt(this.amount)-this.comission,
      'notes': "RAS",
      'service_number': this.utils.getPhone(this.receiverNumber || this.phoneNumber.internationalNumber),
      'user': JSON.parse(localStorage.getItem('user_data')),
      'user_number' : this.utils.getPhone(this.receiverNumber || this.phoneNumber.internationalNumber),
      'receiver_number':this.utils.getPhone(this.receiverNumber || this.phoneNumbers.internationalNumber),
      'receiver_name': "ND"
    }
    this.MakeCashout(this.dataTransaction);
    //console.log(this.transactions.MakeCashout(cashout));
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
                service_number: data.user_number
              }
              //this.postCollect  = await this.con.getDatas("post_collect", donnees3).toPromise();
              console.log("le post collect ici", this.postCollect);
                try {
                  this.postCollect  = await this.con.getDatas("post_collect", donnees3).toPromise();
                  if(this.postCollect.status=="success"){
                    console.log("postcollect", this.postCollect);
                    this.loading.hideLoader();
                    this.hitCodeDiv = true;
                    this.startTimer();
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

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        let mv = this.timeLeft--;
        this.sec = this.texting.secondesText+this.timeLeft+" "+this.texting.secondes;
      } else {
        //this.timeLeft = 60;
        clearInterval(this.interval);
        this.timeLeft = 0;
        this.sec = this.texting.confirmSend;
      }
    },1000)
  }


  async VerifyConfirm(){
    this.loading.showLoader();
                    let donnees4 = {
                      trid : this.postCollect.data.trid,
                      ptn : ""
                    }
                    this.verify  = await this.con.getDatas("verify", donnees4).toPromise();
                    console.log("le verify ici", this.verify);
                    if(this.verify.data.status=="SUCCESS"){
                      this.loading.hideLoader();
                      console.log("fini", this.verify.data.status);
                      console.log("fini", this.dataTransaction);
                      //this.presentToast(this.texting.payOk);
                      //this.transactions.SaveCashOutTransaction();
                      this.transactions.SaveCashOutTransaction(this.dataTransaction, this.verify.data);
                      
                      }
                      else if(this.verify.data.status=="ERRORED"){
                        this.loading.hideLoader();
                        //this.notice.showWarning("Oups, votre paiement a échoué veuillez réssayer.", "Paiement échoué");
                        this.hitCodeDiv = false;
                        this.presentToast(this.texting.payErrorr);
                      }
                      else if(this.verify.data.status=="PENDING"){
                        this.loading.hideLoader();
                        this.hitCodeDiv = true;
                        this.presentToast(this.texting.payPending);
                        //this.notice.showWarning("Veuillez Confirmez votre transaction avant de poursuivre. Si cette erreur persite veuillez contacter notre service client.", "Paiement En attende");
                        //this.hitCodeDiv = true;
                      }
                      else{
                        this.loading.hideLoader();
                        this.presentToast(this.texting.error);
                       // this.saveOrders(this.verify);
                        //this.notice.showWarning("Une erreur s'est produite, veuillez réessayer ultérieurement.", "Paiement En attende");
                      }
  }

  cardConfirm(){
    const mois = 'MM';
    const year = 'yyyy';
    const locale = 'en-US';
   this.step4 = true;
    let card = {
      number: this.card_number,
      expMonth: formatDate(this.dateText, year, locale),
      expYear: formatDate(this.dateText, mois, locale),
      cvc: this.card_code,
     }
    console.log("Ma carte", card);
    this.launchPay(card);
  }

  launchPay(card){
    this.stripe.setPublishableKey('pk_test_51LTLAbH25XYFzVi4sYhQi8sUYHvtdzkQ4L8ap3YLxNtcbAIyYzXSzTaOzjP2S95zEgFIvycKBOtV8WbYXeVNQ7ef00AoS8auPb');
    this.stripe.createCardToken(card)
    .then(token => {
      console.log("your token is here", token);
      this.makePayment(token);
    })
    .catch(error =>{
      console.error("Erruer de carte", error)
      //this.presentToast(this.texting.payeder+" : "+error.message);
    });
  }

  async  makePayment(token) {
    let payment = {
      token: token.id,
      price: 500,
      email : "hello@micheltanga.com"
      }
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
        duration: 2000
      });
      await loading.present();
      this.con.getDatas("debit_card", payment).subscribe( async (data:any)=> {
        console.log(data);
        console.log(data.status);
        if(data.status=="success"){
          this.makeCommand();
        }
      }, (err) => {
        this.presentToast(err.text);
        console.log(err);
        console.log(err.text);
       
      });
      const { role, data } = await loading.onDidDismiss();
      console.log('Loading dismissed!');
 }

 makeCommand(){

 }

 async presentToast(message) {
  const toast = await this.toastController.create({
    message: message,
    duration: 3000
  });
  toast.present();
}

}

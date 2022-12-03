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
import { StripeService } from 'src/app/shared/api/stripe.service';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { LoadingService } from 'src/app/shared/utils/loading.service';

class Port {
  public id: string;
  public name: string;
}
@Component({
  selector: 'app-euro',
  templateUrl: './euro.page.html',
  styleUrls: ['./euro.page.scss'],
})
export class EuroPage implements OnInit {
  language: string = this.translateService.currentLang; // 2 
  texting : any = {};
  currencies: any;

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
  phoneNumber : any;
  phoneNumbers : any;
  country : any;
  amount: any;

  currency : string = 'CAD';
  
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
  methodService: any;
  warningPhone: any = "";
  warningPhone1: any = "";
  settings: any = [];
  comission: any;
  donnee: any;
  mois: any;
  annee: any;
  month: any;
  year: any;
  receiverNumber: any;
  contactName: string;
  contactNumber: string;
  account: any = {};




   constructor(
    public router: Router,
    private translateService: TranslateService,
    private conversionService : ConversionService,
    private stripe : StripeService,
    private loading : LoadingService,
    private con : MavianceService,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public utils : FunctionsService,
    private transactions : TransactionsService,
    private contacts: Contacts,
    private alertController : AlertController,
    private alertCtrl: AlertController
  ) {

     //this.stripe.setPublishableKey('my_publishable_key');
     this.conversionService.getCurencies().subscribe( async (da:any)=>{
      this.currencies = da.supported_codes;
      console.log("données deconversion", da);
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
    this.user = JSON.parse(localStorage.getItem('user_data'));
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
    console.log(data);
    this.texting = data;
   });
}

pickContact(){
  this.contacts.pickContact().then((contact)=>{
  //console.log("Selected contacts: "+ JSON.stringify(contact));
 // alert(JSON.stringify(contact));
 // this.contactName = contact.displayName; 
 // alert(this.contactName);
 // this.contactNumber = contact.phoneNumbers[0].value; 
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



  cardStatus(){
    let valt = 0;
    if(this.card_number){
      if(this.card_number.toString().length == 16 ){
         valt = valt + 1;
      }
     }
    if(this.month !=null && this.month!="" && parseInt(this.month)<13 && parseInt(this.month)>0 && this.month.toString().length == 2){
      valt = valt + 1;
    }
    if(this.year !=null && this.year!="" && this.year.toString().length == 4){
      valt = valt + 1;
    }
    if(this.card_code){
      if(this.card_code.toString().length == 3){
        valt = valt + 1;

   }
    }
    console.log("var", valt)
    return valt;
 }




  onChange(value){
    //console.log("value", value.detail.value)
   // console.log("methods", this.methods)
    this.methodService = this.services.find((service) => service.id == value.detail.value);
    console.log("service", this.methodService);
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
     if(this.receiverNumber){
      console.log("Mon numero bon", this.receiverNumber);
      console.log("Mon numero bon longueur ", this.receiverNumber.length);
      if(this.receiverNumber?.length == 18){
        valR = valR + 1;
        if(this.utils.checkMtnPhone(this.receiverNumber, this.methodService.regex)==true){
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
      //console.log("m phone", this.phoneNumbers)
     if(this.phoneNumbers.nationalNumber.length == 13 ){
        valR = valR + 1;
       // console.log("phpm", this.utils.checkMtnPhone(this.phoneNumbers.internationalNumber, this.methodService.regex))
        if(this.utils.checkMtnPhone(this.phoneNumbers.internationalNumber, this.methodService.regex)==true){
          valR = valR + 1;
          this.warningPhone = ""
        }
        else{
          this.warningPhone = this.texting.warningPhone;
        }
        //this.utils.checkMtnPhone(this.phoneNumbers.internationalNumber, "");
     }
    }
    console.log("somme", valR)
   
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
    this.account  = await this.con.getData("get_account").toPromise();
    console.log(this.account.data.balance);
    this.loading.hideLoader();

    console.log(this.comission);
    this.conversionService.conversionPair(this.country, "XAF").subscribe( async (da:any)=>{
     console.log(da)
     this.currencies = da;
     this.amountConverted = this.currencies.conversion_rate * this. amount;
     this.settings  = await this.con.getData("get_settings").toPromise();
     let donnee = this.settings.data.find((setting) => setting.meta_name == "comission");
     this.donnee = donnee.value;
     this.comission = 0
     this.comission = (this.donnee*this.amountConverted)/100;
     this.loading.hideLoader();
     if(this.account.data.balance>this.amountConverted){
      this.loading.hideLoader();
      this.showed = true;
    }
    else{
        this.loading.hideLoader();
        this.showed = false;
        this.presentToast(this.texting.insuffisantFunds);
        
    }
    // this.showed = true;
   })  
   
 }


 toEuro(amount){
   return amount/this.currencies.conversion_rate;
 }

 async sendConfirm(){
    let data = {
      'serviceCashOut' : "CB",
      'serviceCashIn' : this.services.find((service) => service.id == this.method),
      'transaction_amount': parseInt(this.amount),
      'type': "DebitCard",
      'status': "PENDING",
      'transaction_number': "0",
      'transaction_comission': parseInt(this.donnee),
      'amount_transfered': (this.amountConverted-this.comission).toFixed(0),
      'notes': "RAS",
      'currency' : this.country,
      'service_number': this.settings.data.find((setting) => setting.meta_name == "phone").value,
      'user': JSON.parse(localStorage.getItem('user_data')),
      'user_number' : this.utils.getPhone(this.receiverNumber || this.phoneNumber.internationalNumber),
      'receiver_number':this.utils.getPhone(this.receiverNumber || this.phoneNumber.internationalNumber),
      'receiver_name': "ND",
      'card' : {
        number: this.card_number,
        expMonth: this.month,
        expYear: this.year,
        cvc: this.card_code,
       }
    }
    this.stripe.MakePayement(data);
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

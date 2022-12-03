import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1
import { Router } from '@angular/router';
import { ToastController, Platform, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../shared/data/auth.service';
import { MavianceService } from '../shared/api/maviance.service';
import { LoadingService } from '../shared/utils/loading.service';
import { FunctionsService } from '../shared/utils/functions.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  language: string = this.translateService.currentLang; // 2 
  texting : any = {};
  private spinner: any;
  first_name : any;
  last_name : any;
  phone : any;
  email : any;
  password : any;
  repassword : any;
  userbyPhone : any = {};
  userbyEmail : any = {};
  user : any = {};
  phoneNumber : any;

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(
     private translateService: TranslateService,
     private router: Router,
     public loadingCtrl: LoadingController,
     private alertController : AlertController,
     private toastController : ToastController,
     public authService: AuthService,
     public loading : LoadingService,
     private con : MavianceService,
     public utils : FunctionsService,
  ) { }

  ngOnInit() {
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }

  async register(){
    if(this.first_name == null || this.first_name == ""){
      this.presentToast(this.texting.FnameErr);
    }
    else if(this.last_name == null || this.last_name == ""){
      this.presentToast(this.texting.LnameErr);
    }
    else if(this.phoneNumber == null || this.phoneNumber == ""){
      this.presentToast(this.texting.phoneErr);
    }
    else if (this.email == null || this.email == ""){
      this.presentToast(this.texting.emptyEmailErr);
    }
    else if (this.utils.checkEmail(this.email)==false){
      this.presentToast(this.texting.emailErr);
    }
    else if (this.password == null || this.password == "" || this.password.length <6){
      this.presentToast(this.texting.passwordErr);
    }
    else{
          this.loading.showLoader();
          let data ={
            uid: "",
            email: this.email,
            displayName: this.first_name +" "+this.last_name,
            photoURL: "",
            status : false,
            phone : this.phoneNumber.internationalNumber,
            first_name : this.first_name,
            last_name : this.last_name,
            address : "",
            password : this.password
          }
          console.log(data);
          this.userbyPhone  = await this.con.getDatas("phoneexist", data).toPromise();
          if(this.userbyPhone.data.length == 0){
            this.userbyEmail  = await this.con.getDatas("emailexist", data).toPromise();
            console.log("", this.userbyEmail);
            if(this.userbyEmail.data.length == 0){
              
              this.user  = await this.con.getDatas("register", data).toPromise();
              console.log("user", this.user);
              this.loading.hideLoader();
              if(this.user.data){
                localStorage.setItem('mail_user', this.email);
                this.router.navigate(['/guest']);
              }
              else{
                this.presentToast(this.texting.errorRegistered);
              }
            }
            else{
              this.loading.hideLoader();
              this.presentToast(this.texting.existemail);
            }

          }
          else{
            this.loading.hideLoader();
            this.presentToast(this.texting.existPhone);
          }
       // }

    }
}


hideShowPassword() {
  this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}




async presentToast(message) {
  const toast = await this.toastController.create({
    message: message,
    duration: 3000
  });
  toast.present();
}


term(){
  window.open("https://hellomoney.cm/cgu", "_blank");
}

login(){
  this.router.navigate(['/login']);
}


}

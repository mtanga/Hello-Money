import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1
import { Router } from '@angular/router';
import { ToastController, Platform, AlertController } from '@ionic/angular';
import { AuthService } from '../shared/data/auth.service';
import { MavianceService } from '../shared/api/maviance.service';
import { LoadingService } from '../shared/utils/loading.service';
import { FunctionsService } from '../shared/utils/functions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  language: string = this.translateService.currentLang; // 2 
  
  texting : any = {};
  userEmail: any = {};
  user: any = {};
  phone : any;
  email : any;
  password : any;
  repassword : any;


  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';


  public backgroundImage = '../../assets/img/background/background-5.jpg';
  constructor(
     private translateService: TranslateService,
     private router: Router,
     private alertController : AlertController,
     private toastController : ToastController,
     private con : MavianceService,
     public loading : LoadingService,
     public utils : FunctionsService,
  ) { }

  ngOnInit() {
      this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }


hideShowPassword() {
  this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}

async forgot(){
    const alert = await this.alertController.create({
      header: this.texting.SendMeMail,
      message: this.texting.mailSend,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder : 'votre@email.com'
        }
      ],
      buttons: [
        {
          text: this.texting.Cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.texting.Validate,
          handler: (data) => {
            console.log('Confirm Ok');
            if(data.email.trim() != ''){
              console.log('email : ' + data.email);
              //this.auth.passwordResetEmail(data.email) 
              this.ForgotPassword(data.email);
              this.presentToast(this.texting.checksms);
            }
            
          }
        }
      ]
    });
    await alert.present();
}

register(){
  this.router.navigate(['/register']);
}

async ForgotPassword(email){
  this.loading.showLoader();
  let data = {
    email : email
  }
  this.userEmail  = await this.con.getDatas("reset", data).toPromise();
  this.loading.hideLoader();
  this.presentToast(this.texting.mailsend);
}



async loginWithEmail(){
  if (this.email == null || this.email == ""){
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
    let data = {
      email : this.email,
      password : this.password
    }
    this.user  = await this.con.getDatas("signin", data).toPromise();
    this.loading.hideLoader();
    //console.log(this.user);
    if(this.user?.message == "Unauthorized"){
      this.presentToast(this.texting.FailConnexion);
    }
    else if(this.user?.message == "Unverified"){
      console.log(this.texting)
      this.presentToast(this.texting.Unveirified);
    }
    else if(this.user?.message == "Success"){
      console.log("user", this.user);
      console.log("user2", this.user.message);
      localStorage.setItem('user_data', JSON.stringify(this.user.data));
      this.router.navigate(['tabs/tab1']);
      ////this.router.navigate(['/tabs/tab1']);
    }
    else{
      this.presentToast(this.texting.error);
    }
  }
}


  /* Function Shows Notifications */
  async presentToast(message : string){
    const toast = await this.toastController.create({
      message: message,
      duration: 6000
    });
    toast.present();
  }


  languageChange() {  // add this
    this.translateService.use(this.language);  // add this
    console.log(this.language);
    localStorage.setItem('language_user',this.language);
    //this.getL();

  } 


}

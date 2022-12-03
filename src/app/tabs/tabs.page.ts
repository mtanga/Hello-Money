import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core'; // 1
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { ToastController, Platform, AlertController } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
declare var cordova;

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{
  log: boolean;
  language: string = this.translateService.currentLang; // 2 
  texting : any = {};
  email = {
  to: 'hello@micheltanga.com',
  cc: 'michelhtanga@gmail.com',
  bcc: ['micheltanga@yandex.com'],
  attachments: [
    'file://img/logo.png',
    'res://icon.png',
    'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
    'file://README.pdf'
  ],
  subject: 'GT Finance new topic',
  body: 'Hello, i need help!',
  isHtml: true
};

  constructor(
    public router: Router,
    private translateService: TranslateService,
    private callNumber: CallNumber,
    //private emailComposer: EmailComposer
        private alertController : AlertController,
     private toastController : ToastController,
     public platform: Platform,
     private socialSharing: SocialSharing) 
     {
    this.log = false;
    }

  ngOnInit() {
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }

langue(){
  this.router.navigate(['/langue']);
}

profile(){
  this.router.navigate(['/tabs/tab3']);
}

  SendEmail(){
      // Share via email
    this.socialSharing.shareViaEmail('Body', 'Subject', ['hello@micheltanga.com']).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

  call(){
  this.callNumber.callNumber("+237674717852", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  faq(){
    window.open("https://test.camertour.net/faq", "_self");
  }

  help(){
    window.open("https://test.camertour.net/help", "_self");
  }

  privacy(){
    window.open("https://test.camertour.net/privacy/81", "_self");
  }

  about(){
    window.open("https://afitra.cm/voirhotel", "_self");
  }
  terms(){
    window.open("https://test.camertour.net/terms-amp-conditions/82", "_self");
  }



async note(){
    const alert = await this.alertController.create({
      header: this.texting.notet,
      message: this.texting.noteexp,
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
            
          }
        }
      ]
    });
    await alert.present();
}


async invite(){
    const alert = await this.alertController.create({
      header: this.texting.SendMeMail,
      message: this.texting.mailSend,
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
              const url = "https://test.camertour.net"
              this.socialSharing.share('GT Finance', null, 'test', url);
            
          }
        }
      ]
    });
    await alert.present();
}

chat() {
  window.open("https://api.whatsapp.com/send?phone=237674717852", "_self");

}


async contact(){
    const alert = await this.alertController.create({
      header: this.texting.smst,
      message: this.texting.sms,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder : ' need help'
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
          text: this.texting.sende,
          handler: (data) => {
            console.log('Confirm Ok');
            if(data.email.trim() != ''){
              console.log('email : ' + data.email);
              //this.auth.passwordResetEmail(data.email)
              this.presentToast(this.texting.checksms);
            }
            
          }
        }
      ]
    });
    await alert.present();
}


 /* Function Shows Notifications */
  async presentToast(message : string){
    const toast = await this.toastController.create({
      message: message,
      duration: 6000
    });
    toast.present();
  }



}



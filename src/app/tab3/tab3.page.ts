import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1
import { Router } from '@angular/router';
import { AuthService } from '../shared/data/auth.service';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { ProfileService } from '../shared/data/profile.service';
import { NotificationService } from '../shared/data/notification.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { MavianceService } from '../shared/api/maviance.service';
import { LoadingService } from '../shared/utils/loading.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  language: string = this.translateService.currentLang; // 2 
  texting : any = {};
  user: any = {};
  userPhoto: any = {};
  userPass: any = {};


   constructor(
    public router: Router,
    private translateService: TranslateService,
    public authService: AuthService,
    public actionSheetController: ActionSheetController,
    public profileService: ProfileService,
    private camera: Camera,
    private loading : LoadingService,
    private con : MavianceService,
    private alertController : AlertController,
    public toastController: ToastController,
    public notificationService: NotificationService,
  ) {
    
  }

    ngOnInit() {
      this.user = JSON.parse(localStorage.getItem('user_data'));
      let foo = this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }

  test(){
    console.log("ici")
  }

  logout(){
    localStorage.removeItem('user_data');
    this.router.navigate(['/login'])

  }

  verify(){

  }

  getUser(){
    this.profileService.GetUserItem(this.user.uid)
    .subscribe(data => {
      localStorage.setItem('user_data', JSON.stringify(data[0]));
      this.user = JSON.parse(localStorage.getItem('user_data'));
     //console.log("infos User", data[0])
   });
  }

  async changePhoto(){
   // console.log('I care about humanity',await this.profileService.GetUserItem(this.user.uid));
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
            if(data[0]=="galery"){
              this.getPhotoLibrary();
            }
            else{
              this.getPhotoCamera();
            }
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }


  getPhotoCamera(){
   // console.log("sourceType", sourceType);
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
    }
    this.camera.getPicture(options).then(
      imagePath => {
        let base64Imagew = 'data:image/jpeg;base64,' + imagePath;
        console.log(base64Imagew)
        this.saveImage(base64Imagew);
       // this.profileService.updatePhoto(this.user.uid, base64Imagew);

    })

  }

  getPhotoLibrary(){
    //console.log("sourceType", sourceType);
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }
    this.camera.getPicture(options).then(
      imagePath => {
        let base64Imagew = 'data:image/jpeg;base64,' + imagePath;
        console.log(base64Imagew)
        this.saveImage(base64Imagew);
       // this.profileService.updatePhoto(this.user.uid, base64Imagew);

    })

  }

  async saveImage(image){
    this.loading.showLoader();
    let data = {
      user : this.user.id,
      image : image
    }
    this.user = await this.con.getDatas("photo", data).toPromise();
    console.log("this.user", this.user);
     this.loading.hideLoader();
     localStorage.setItem('user_data', JSON.stringify(this.user.data));
     this.user = JSON.parse(localStorage.getItem('user_data'));
  }

  

  async profile(){
    this.alertController.create({
      header: 'Votre profil',
     // subHeader: 'Beware lets confirm',
      message: 'Souhaitez-vous modifier les informations de votre profil ?',
      inputs: [
        {
          name: "prenom",
          type : "text",
          value: this.user.first_name,
          placeholder: 'Prénom',
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          name: "nom",
          type : "text",
          placeholder: 'Nom',
          value: this.user.last_name,
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          name: "phone",
          type : "text",
          placeholder: 'Téléphone',
          value: this.user.phone,
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          name: "address",
          type : "textarea",
          placeholder: 'Adresse',
          value: this.user.address,
          handler: () => {
            console.log('I care about humanity');
          }
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          text: 'Valider',
          handler: (data) => {
            const datas = {
              first_name : data.prenom,
              last_name :data.nom,
              address :data.address,
              phone :data.phone,
              displayName : data.prenom +" "+ data.nom,
              id : this.user.id
            };
            this.saveprofile(datas);
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }


  async saveprofile(data){
    if(data.first_name == null || data.first_name == ""){
      this.presentToast(this.texting.FnameErr);
    }
    else if(data.last_name == null || data.last_name == ""){
      this.presentToast(this.texting.LnameErr);
    }
    else if(data.address == null || data.address == ""){
      this.presentToast(this.texting.addrr);
    }
    else if(data.phone == null || data.phone == ""){
      this.presentToast(this.texting.phoneErr);
    }
    else{
    this.loading.showLoader();
    this.user = await this.con.getDatas("editprofile", data).toPromise();
    this.loading.hideLoader();
    localStorage.setItem('user_data', JSON.stringify(this.user.data));
    this.user = JSON.parse(localStorage.getItem('user_data'));
    }
  }

  notification(){
    this.router.navigate(['/notifications'])
  };


  security(){
    this.router.navigate(['/profile'])
  };

  langue(){
    this.router.navigate(['/langue'])
  }

  call(){

  }

  SendEmail(){

  }

  async serviceClient() {
    const actionSheet = await this.actionSheetController.create({
      //header: 'Service client',
      header: "Service client",
      cssClass : 'serviceclient',
        buttons: [{
        text: '+237 6 XX XX XX XX',
        role: 'destructive',
        icon: 'call',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'contact@hellomoney.com',
        icon: 'mail',
        handler: () => {
          console.log('Share clicked');
        }
      },{
        text: 'https://www.hellomoney.cm',
        icon: 'globe',
        handler: () => {
          console.log('Favorite clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async noter() {
    const actionSheet = await this.alertController.create({
      //title: 'Hello',
      header: "Noter l'application",
      message: "Vous allez être redirigez sur la store",
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: "Annuler",
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: "Laissez moi noter",
          handler: (data) => {
            console.log('Confirm Ok');
              //console.log('email : ' + data.email);
              //this.auth.passwordResetEmail(data.email)
              //this.presentToast("Veuillez consulter votre messagerie car un email de réinitialisation du mot de passe vous a été envoyé ");
            
            
          }
        }
      
      ]
    });
    await actionSheet.present();
  }

  async editPasswordPrompt() {
    const alert = await this.alertController.create({
      header: this.texting.passchange,
      inputs: [
        {
          name: 'oldPassword',
          type: 'password',
          placeholder : this.texting.oldpass
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder : this.texting.newpass
        },
        {
          name: 'conPassword',
          type: 'password',
          placeholder : this.texting.repeat
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.updatePassword(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async updatePassword(data){
    if (data.oldPassword == null || data.oldPassword == "" || data.oldPassword.length <6){
      this.presentToast(this.texting.passwordErr);
    }
    else if(data.newPassword == null || data.newPassword == "" || data.newPassword.length <6){
      this.presentToast(this.texting.passwordErr);
    }
    else if(data.conPassword == null || data.conPassword == "" || data.conPassword.length <6){
      this.presentToast(this.texting.passwordErr);
    }
    else if(data.newPassword != data.conPassword){
      this.presentToast(this.texting.different);
    }
    else{
      this.loading.showLoader();
      let datas ={
        password : data.newPassword,
        current : data.oldPassword,
        id : this.user.id
      }
      this.user = await this.con.getDatas("editpass", datas).toPromise();
      this.loading.hideLoader();
      console.log("user", this.user);
      if(this.user.message == "Error"){
        this.presentToast(this.texting.passOldErr);
      }
      else if (this.user.message == "Success"){
        this.presentToast(this.texting.passok);
      }
      else{
        this.presentToast(this.texting.error);
      }
    }
  }


      // send messages 
    async presentToast(text) {
      const toast = await this.toastController.create({
        message: text,
        duration: 2000
      });
      toast.present();
    }

}
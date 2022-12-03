import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {IonicInputMaskModule} from "@thiagoprz/ionic-input-mask";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
// other imports here...
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

import {Contacts} from '@ionic-native/contacts/ngx';
// imports...
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MatStepperModule } from "@angular/material/stepper";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    CommonModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonIntlTelInputModule,
    ReactiveFormsModule,
    FormsModule,
    IonicInputMaskModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatToolbarModule,
    HttpClientModule, // <--- add this
    TranslateModule.forRoot({ // <--- add this
      loader: { // <--- add this 
        provide: TranslateLoader, // <--- add this
        useFactory: (createTranslateLoader),  // <--- add this
        deps: [HttpClient] // <--- add this
      } // <--- add this
    }) // <--- add this
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StatusBar,
    SplashScreen,
    SocialSharing,
    CallNumber,
    Contacts,
    Camera,
     HTTP,
     Stripe
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent],
})
export class AppModule {}

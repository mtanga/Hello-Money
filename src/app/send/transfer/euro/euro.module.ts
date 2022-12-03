import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EuroPageRoutingModule } from './euro-routing.module';
import { EuroPage } from './euro.page';
// other imports...
import {  HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonIntlTelInputModule,
    IonicSelectableModule,
    EuroPageRoutingModule,
            // other stuff...
            TranslateModule.forChild({
              loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
              }
            })
  ],
  declarations: [EuroPage]
})
export class EuroPageModule {}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalPageRoutingModule } from './local-routing.module';

import { LocalPage } from './local.page';

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
    ReactiveFormsModule,
    IonicModule,
    IonIntlTelInputModule,
    IonicSelectableModule,
    LocalPageRoutingModule,
        // other stuff...
        TranslateModule.forChild({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        })
  ],
  declarations: [LocalPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class LocalPageModule {}

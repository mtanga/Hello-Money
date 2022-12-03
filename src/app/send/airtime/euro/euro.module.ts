import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EuroPageRoutingModule } from './euro-routing.module';

import { EuroPage } from './euro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EuroPageRoutingModule
  ],
  declarations: [EuroPage]
})
export class EuroPageModule {}

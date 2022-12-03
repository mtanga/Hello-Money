import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EuroPage } from './euro.page';

const routes: Routes = [
  {
    path: '',
    component: EuroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EuroPageRoutingModule {}

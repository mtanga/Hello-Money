import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.scss'],
})
export class TransferPage implements OnInit {
  language: string = this.translateService.currentLang; // 2 
  texting : any = {};



  constructor(
     private translateService: TranslateService,
  ) { }

  ngOnInit() {
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }

}

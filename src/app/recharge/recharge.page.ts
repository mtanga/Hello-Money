import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1
import { Router } from '@angular/router';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.page.html',
  styleUrls: ['./recharge.page.scss'],
})
export class RechargePage implements OnInit {
  language: string = this.translateService.currentLang; // 2 
  texting : any = {};


   constructor(
    public router: Router,
    private translateService: TranslateService,
  ) {
    
  }

  ngOnInit() {
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }

}

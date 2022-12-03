import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1
import { Router } from '@angular/router';

@Component({
  selector: 'app-airtime',
  templateUrl: './airtime.page.html',
  styleUrls: ['./airtime.page.scss'],
})
export class AirtimePage implements OnInit {
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

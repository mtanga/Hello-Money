import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1


@Component({
  selector: 'app-langue',
  templateUrl: './langue.page.html',
  styleUrls: ['./langue.page.scss'],
})
export class LanguePage implements OnInit {
  language: string = this.translateService.currentLang; // 2 
  texting : any = {};
  CurrentL: any;
  lango: string;
  showl: any;

  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
     this.getL();
  }

  languageChange() {  // add this
    this.translateService.use(this.language);  // add this
    //this.storeLanguage(this.language);
    console.log(this.language);
    localStorage.setItem('langi',this.language);
    this.getL();

  }  // add this

  getL(){
    this.lango = localStorage.getItem('langi');
    if (this.lango!==null || this.lango!==undefined){
      let l = this.lango;
      if(l=="en"){
       this.showl = true;
      }
      else{
       this.showl = false;
      }
    }
    else{
      this.showl = false;
    }
  }

}

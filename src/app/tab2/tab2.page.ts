import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1
import { Router } from '@angular/router';
import { ConversionService } from '../shared/api/conversion.service';
import { IonicSelectableComponent } from 'ionic-selectable';

class Port {
  public id: string;
  public name: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  language: string = this.translateService.currentLang; // 2 
  texting : any = {};
  currencies: any;

  portsb: Port[] = [];
  portsc: Port[] = [];
  
  portb: Port;
  portc: Port;
  deviseb: any;
  devisec: any;

  showed : boolean = false;
  user: any;


   constructor(
    public router: Router,
    private translateService: TranslateService,
    private conversionService : ConversionService,
  ) {


     this.conversionService.getCurencies().subscribe( async (da:any)=>{
      this.currencies = da.supported_codes;
      this.currencies.forEach(element => {
       // console.log(element)
       let data = {
        id : element[0],
        name : element[1]
        };
        this.portsb.push(data); 
        this.portsc.push(data); 
      });
        //console.log(this.ports)
    })


  }

  portChangeb(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.deviseb = event.value;
    console.log('portb:', event.value);
  }


  portChangec(event: {
    component: IonicSelectableComponent,
    value: any
   }) {
    console.log('portc:', event.value);
    this.devisec = event.value;
  }


    ngOnInit() {
      this.user = JSON.parse(localStorage.getItem('user_data'));
    let foo = this.translateService.get('chaines').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }

  notification(){
    console.log("");
  }

  convert(){
   // console.log(this.deviseb)
     this.conversionService.conversionPair(this.deviseb.id, this.devisec.id).subscribe( async (da:any)=>{
      console.log(da)
      this.currencies = da;
      this.showed = true;
    }) 
  }




}


import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core'; // 1
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  language: string = this.translateService.currentLang; // 2 
  deja : any;

  constructor(
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  next() {
    this.slides.slideNext();
  }

  skip(){
       this.deja = 'true';
       localStorage.setItem('primer',this.deja);
       this.router.navigate(['/tabs/tab1']);
  }
  go(){
       this.deja = 'true';
       localStorage.setItem('primer',this.deja);
       this.router.navigate(['/tabs/tab1']);
  }

}

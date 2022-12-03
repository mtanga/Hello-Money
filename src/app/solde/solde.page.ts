import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MavianceService } from '../shared/api/maviance.service';
import { LoadingService } from '../shared/utils/loading.service';

@Component({
  selector: 'app-solde',
  templateUrl: './solde.page.html',
  styleUrls: ['./solde.page.scss'],
})
export class SoldePage implements OnInit {
  message: any;
  language: string = this.translateService.currentLang; // 2 
  sub: any;

  constructor(
    public loading : LoadingService,
    private con : MavianceService,
    private translateService: TranslateService,
    private router: Router,
    private route : ActivatedRoute,
  ) { }

  ngOnInit() {
    //this.loading.showLoader();
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.message = params['message'];
    });
  //  this.loading.hideLoader();
  }

  again(){
    this.router.navigate(['/tabs/tab1']);
  }

}

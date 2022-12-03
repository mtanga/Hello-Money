import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinctionsService {

  constructor() { }




checkMtnPhone(phoneNumber, regex)
  {
    let phone1 = phoneNumber.replace("+","");
    let phone = phone1.replace(/\s/g, '');
    var phoneRGEX = regex;
    return phoneRGEX.test(phone);
  }
}

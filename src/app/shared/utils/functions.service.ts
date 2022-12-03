import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor() { }

  checkMtnPhone(phoneNumber, regex)
  {
    let phone1 = phoneNumber.replace("+","");
    let phone = phone1.replace(/\s/g, '');
    var phoneRGEX = regex;
    return phoneRGEX.test(phone);
  }


  getPhone(phone){
      let phone1 = phone.replace("+","");
      return phone1.replace(/\s/g, '');
  }


  checkEmail(email){
    let regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email);
  }
}

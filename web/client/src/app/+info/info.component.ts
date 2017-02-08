import { Component, OnInit } from '@angular/core';

import { InfoServiceAgent } from '../service-agents';
import { Balance } from '../models/webapi';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
})
export class InfoComponent implements OnInit {

  balance: Balance;
  showSpinner: boolean;

  constructor(
    private infoServiceAgent: InfoServiceAgent
  ) {
  }

  ngOnInit() {
  }

  getBalance(refresh = false) {
    this.showSpinner = true;
    this.infoServiceAgent.getBalance()
      .subscribe(
      response => {
        this.balance = response;
        this.showSpinner = false;
      },
      err => {
        this.showSpinner = false;
      });
  }

}

import { Component, OnInit } from '@angular/core';

import { InfoServiceAgent } from '../service-agents';
import { InfoViewModel } from '../models';

declare let Web3: any;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
})
export class InfoComponent implements OnInit {

  infos: InfoViewModel[];
  showSpinner: boolean;

  constructor(
    private infoServiceAgent: InfoServiceAgent
  ) {
  }

  ngOnInit() {
    // this.getInfos();
    this.ensureWeb3();
  }

  private ensureWeb3() {
    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
  }
  web3: any;

  watchBalance() {
    this.showSpinner = true;
    this.coinbase = this.web3.eth.coinbase;
    this.originalBalance = this.web3.eth.getBalance(this.coinbase).toNumber();
    // document.getElementById('coinbase').innerText = 'coinbase: ' + coinbase;
    // document.getElementById('original').innerText = ' original balance: ' + originalBalance + '    watching...';
    this.web3.eth.filter('latest').watch(() => {
      this.currentBalance = this.web3.eth.getBalance(this.coinbase).toNumber();
      // document.getElementById("current").innerText = 'current: ' + currentBalance;
      // document.getElementById("diff").innerText = 'diff:    ' + (currentBalance - originalBalance);
      this.showSpinner = false;
    });
  }
  coinbase: number;
  originalBalance: number;
  currentBalance: number;
  private getInfos(refresh = false) {
    this.showSpinner = true;
    this.infoServiceAgent.getInfos()
      .subscribe(
      response => {
        this.infos = response;
        this.showSpinner = false;
      },
      err => {
        this.showSpinner = false;
      });
  }

}

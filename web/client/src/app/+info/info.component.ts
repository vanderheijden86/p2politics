import { Component, OnInit } from '@angular/core';

import { InfoServiceAgent } from '../service-agents';
import { InfoViewModel } from '../models';

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
    this.getInfos();
  }

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

import { Component, OnInit, OnDestroy } from '@angular/core';

import { Proposal } from '../../models/proposal.model';

@Component({
    selector: 'app-proposal-detail',
    templateUrl: './proposal-detail.component.html',
    styleUrls: ['./proposal-detail.component.scss'],
})
export class ProposalDetailComponent implements OnInit, OnDestroy {
    proposal: Proposal;

    ngOnInit() {
        this.proposal = <any>{
            title: 'Test title for proposal',
            description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.`
        };
    }

    ngOnDestroy() {

    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Proposal } from '../../models/proposal.model';

@Component({
    selector: 'proposal-add',
    templateUrl: './proposal-add.component.html',
    styleUrls: ['./proposal-add.component.scss']
})
export class ProposalAddComponent implements OnInit, OnDestroy {
    parentProposalId: string;

    formGroup: FormGroup;

    private routeSubscription: Subscription;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.initForm();
        this.routeSubscription = this.route.params.subscribe(params => {
            console.log(params);
            this.parentProposalId = params['parentId'];
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    onAddProposal() {
        console.log('Add proposal');
    }

    initForm() {
        this.formGroup = new FormGroup({

        });
    }
}

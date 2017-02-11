import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { ProposalService } from '../../services/proposal.service';
import { Proposal } from '../../models/proposal.model';

@Component({
    selector: 'proposal-add',
    templateUrl: './proposal-add.component.html',
    styleUrls: ['./proposal-add.component.scss']
})
export class ProposalAddComponent implements OnInit, OnDestroy {

    formGroup: FormGroup;

    private domain: string;
    private parentProposalId: string;
    private routeSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private mdSnackBar: MdSnackBar,
        private proposalService: ProposalService) { }

    ngOnInit() {
        this.initForm();
        this.routeSubscription = this.route.params.subscribe(params => {
            console.log('ADD PROPOSAL PARAMS', params);
            this.domain = params['domain'];
            this.parentProposalId = params['parentId'];
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    onAddProposal() {
        if(this.formGroup.invalid) return;
        const formValues = this.formGroup.value;
        const proposal: Proposal = Object.assign(new Proposal(), formValues);
        proposal.domain = this.domain;
        this.proposalService.addProposal(proposal)
            .subscribe(() => {
                this.mdSnackBar.open('Het nieuwe voorstel wordt aangemaakt', 'Sluiten', {
                    duration: 8000
                });
            });
    }

    private initForm() {
        this.formGroup = new FormGroup({
            'title': new FormControl(undefined, Validators.required),
            'description': new FormControl(undefined, Validators.required),
            'category': new FormControl(undefined, Validators.required),
            'phase': new FormControl(undefined),
            'endDate': new FormControl(undefined, Validators.required)
        });
    }
}

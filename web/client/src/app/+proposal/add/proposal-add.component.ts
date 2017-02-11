import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
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
    private iterationId: string;
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
            this.iterationId = params['iterationId'];
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    onAddProposal() {
        if(this.formGroup.invalid) return;
        const formValues = this.formGroup.value;
        const proposal: Proposal = Object.assign(new Proposal(), formValues);
        const hasIteration = !!this.iterationId;
        if(hasIteration) {
            proposal.id = +this.iterationId;
        }
        proposal.domain = this.domain;
        proposal.phase = proposal.phase || '';
        proposal.completed = 0;
        console.log('ADD PROPOSAL', proposal);
        const obs = hasIteration
            ? this.proposalService.addNewIteration(proposal)
            : this.proposalService.addNewProposal(proposal);

        obs.subscribe(() => {
            this.mdSnackBar.open('Het nieuwe voorstel wordt aangemaakt', 'Sluiten', {
                duration: 8000
            });
        }, err => {
            this.mdSnackBar.open('Er is een fout opgetreden', 'Sluiten', {
                duration: 8000
            });
            console.log(err);
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

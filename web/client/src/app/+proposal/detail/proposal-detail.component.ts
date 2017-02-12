import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppConfig } from '../../core/app.config';
import { ProposalService } from '../../services/proposal.service';
import { UserService } from '../../services/user.service';
import { VoteService } from '../../services/vote.service';

import { DomainUser } from '../../models/domain-user.model';
import { Proposal } from '../../models/proposal.model';
import { Vote } from '../../models/vote.model';

@Component({
    selector: 'app-proposal-detail',
    templateUrl: './proposal-detail.component.html',
    styleUrls: ['./proposal-detail.component.scss'],
})
export class ProposalDetailComponent implements OnInit, OnDestroy {
    proposal: Proposal;
    // olderProposalsInIteration: Proposal[];
    vote: Vote;
    user: DomainUser;
    userPending: boolean;

    pending: boolean;
    formGroup: FormGroup;

    private routeSubscription: Subscription;

    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        private mdSnackBar: MdSnackBar,
        private appConfig: AppConfig,
        private proposalService: ProposalService,
        private userService: UserService,
        private voteService: VoteService,
    ) { }

    ngOnInit() {
        this.initForm();
        this.routeSubscription = this.route.params.subscribe(params => {
            this.initUser(params['domain']);
        });

        this.proposal = this.proposalService.activeProposal;
        // this.fillOlderProposalsInIteration(this.proposal);
        this.voteService.getProposalVote(this.proposal)
            .subscribe(response => {
                this.vote = response;
                this.changeDetectionRef.detectChanges();
            });
        //         this.proposal = <any>{
        //             id: 456,
        //             title: 'Test title for proposal',
        //             description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        // Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.

        // Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        // Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.

        // Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`,
        //             category: 'Natuur en Ruimtelijke Ordening'
        //         };
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    onVoteConfirm() {
        if (this.formGroup.invalid) return;
        console.log('VOTED');
        let formValues = this.formGroup.value;
        this.voteService.voteForProposal(this.proposal, +formValues.answer, formValues.reason || '')
            .subscribe(response => {
                this.mdSnackBar.open('U heeft gestemd', 'Sluiten', {
                    duration: 8000
                });
            },
            error => {
                this.mdSnackBar.open('Er is een fout opgetreden', 'Sluiten', {
                    duration: 8000
                });
            });
    }

    onAddProposal() {
        console.log('Add child proposal');
        this.proposalService.addNewIteration(this.proposal)
            .subscribe(response => {
                this.mdSnackBar.open('U heeft een nieuwe iteratie aangemaakt', 'Sluiten', {
                    duration: 8000
                });
            }, error => {
                this.mdSnackBar.open('Er is een fout opgetreden', 'Sluiten', {
                    duration: 8000
                });
            });
    }

    activateProposal(proposal: Proposal) {
        this.proposalService.activeProposal = proposal;
        let redirect = ['proposal', proposal.id];
        this.router.navigate(redirect, {relativeTo: this.route});
    }

    private initForm() {
        this.formGroup = new FormGroup({
            'answer': new FormControl(undefined, Validators.required),
            'reason': new FormControl(undefined)
        });
    }

    private initUser(domain) {
        this.user = undefined;
        this.userPending = true;
        this.userService.getDomainUser(domain)
            .subscribe(user => {
                this.user = user;
                this.onBlockChainCallCompleted(user);
            }, err => {
                this.appConfig.onHttpError(err);
                this.onBlockChainCallCompleted(err);
            });
    }

    private onBlockChainCallCompleted(response) {
        this.userPending = false;
        this.changeDetectionRef.detectChanges();
    }

    // private fillOlderProposalsInIteration(proposal: Proposal) {
    //     this.olderProposalsInIteration = new Array<Proposal>();
    //     for (let index = proposal.iteration; index > 0; index--) {
    //         this.proposalService.getProposalByIdIteration(proposal.id, index)
    //             .subscribe(response => {
    //                 this.olderProposalsInIteration.push(response);
    //             });
    //     }
    // }
}

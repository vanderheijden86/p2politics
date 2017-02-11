import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AppConfig } from '../../core/app.config';
import { UserService } from '../../services/user.service';

import { DomainUser } from '../../models/domain-user.model';
import { Proposal } from '../../models/proposal.model';

@Component({
    selector: 'app-proposal-detail',
    templateUrl: './proposal-detail.component.html',
    styleUrls: ['./proposal-detail.component.scss'],
})
export class ProposalDetailComponent implements OnInit, OnDestroy {
    proposal: Proposal;
    user: DomainUser;
    userPending: boolean;

    pending: boolean;
    formGroup: FormGroup;

    private routeSubscription: Subscription;

    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        private appConfig: AppConfig,
        private userService: UserService) { }

    ngOnInit() {
        this.initForm();
        this.routeSubscription = this.route.params.subscribe(params => {
            this.initUser(params['domainId']);
        });

        this.proposal = <any>{
            id: 456,
            title: 'Test title for proposal',
            description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.

Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.

Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`,
            category: 'Natuur en Ruimtelijke Ordening'
        };
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    onVoteConfirm() {
        if(this.formGroup.invalid) return;
        console.log('VOTED');
    }

    onAddProposal() {
        console.log('Add child proposal');
    }

    private initForm() {
        this.formGroup = new FormGroup({
            'answer': new FormControl(undefined, Validators.required),
            'reason': new FormControl(undefined)
        });
    }

    private initUser(domainId) {
        this.user = undefined;
        this.userPending = true;
        this.userService.getDomainUser(domainId)
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
}

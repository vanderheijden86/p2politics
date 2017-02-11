import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

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

    pending: boolean;

    private routeSubscription: Subscription;

    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        private userService: UserService) { }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            this.initUser(params['domainId'])
        });

        this.proposal = <any>{
            title: 'Test title for proposal',
            description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.`
        };
    }

    ngOnDestroy() {

    }

    private initUser(domainId) {
        this.user = undefined;
        this.userService.getDomainUser(domainId)
            .subscribe(user => {
                this.user = user;
                this.changeDetectionRef.detectChanges();
            });
    }
}

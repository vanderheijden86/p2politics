import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdButtonToggleChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { addDays, isFuture } from 'date-fns';

import { UserService } from '../../services/user.service';
import { ProposalService } from '../../services/proposal.service';
import { DomainUser } from '../../models/domain-user.model';
import { Proposal } from '../../models/proposal.model';

interface ProposalCategory {
    description: string;
    proposals: Proposal[];
}

@Component({
    selector: 'app-proposal-overview',
    templateUrl: './proposal-overview.component.html',
    styleUrls: ['./proposal-overview.component.scss'],
})
export class ProposalOverviewComponent implements OnInit, OnDestroy {
    // proposalStub: Proposal[] = [
    //     <any>{
    //         id: '123', title: 'Title one', category: 'Natuur en Ruimtelijke Ordening',
    //         startDate: addDays(Date.now(), -10),
    //         endDate: addDays(Date.now(), 20),
    //         description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
    //                             Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.`
    //     },
    //     <any>{
    //         id: '456', title: 'Title two', category: 'Natuur en Ruimtelijke Ordening',
    //         startDate: addDays(Date.now(), -30),
    //         endDate: addDays(Date.now(), -5),
    //         description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
    //                             Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.`
    //     },
    //     <any>{
    //         id: '789', title: 'Title three', category: 'Veiligheid',
    //         startDate: addDays(Date.now(), -5),
    //         endDate: addDays(Date.now(), 25),
    //     }
    // ];
    proposals: Proposal[];
    proposalCategories: ProposalCategory[];
    user: DomainUser;

    private routeSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private proposalService: ProposalService) { }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            let domainId = params['domainId'];
            console.log('DOMAIN ID', domainId);
            this.userService.getDomainUser(domainId)
                .subscribe(user => this.user = user);
            this.proposalService.getProposals(domainId)
                .subscribe(proposals => {
                    this.proposals = proposals;
                    this.fillProposalGroups(proposals);
                });
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    onAddProposal() {
        console.log('Add proposal');
    }

    activateProposal(proposal: Proposal) {
        this.proposalService.activeProposal = proposal;
        let redirect = ['proposal', proposal.id];
        this.router.navigate(redirect, {relativeTo: this.route});
    }

    showClosedProposels = false;
    showClosedProposelsChanged(event: MdButtonToggleChange) {
        this.showClosedProposels = event.source.checked;
        this.fillProposalGroups(this.proposals);
    }

    private fillProposalGroups(proposals: Proposal[]) {
        let categories: ProposalCategory[] = [];
        proposals.forEach(proposal => {
            if (this.showClosedProposels || isFuture(proposal.endDate)) {
                let category = categories.find(cat => cat.description === proposal.category);
                if (!category) {
                    categories.push(category = { description: proposal.category, proposals: [] });
                }
                category.proposals.push(proposal);
            }
        });
        this.proposalCategories = categories;
    }
}

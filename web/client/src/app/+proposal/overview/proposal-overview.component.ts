import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { addDays } from 'date-fns';

import { UserService } from '../../services/user.service';
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
    proposalStub: Proposal[] = [
        <any>{
            id: '123', title: 'Title one', category: 'Natuur en Ruimtelijke Ordening',
            startDate: addDays(Date.now(), -10),
            endDate: addDays(Date.now(), 20),
            description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.`
        },
        <any>{
            id: '456', title: 'Title two', category: 'Natuur en Ruimtelijke Ordening',
            startDate: addDays(Date.now(), -30),
            endDate: addDays(Date.now(), -5),
            description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.`
        },
        <any>{
            id: '789', title: 'Title three', category: 'Veiligheid',
            startDate: addDays(Date.now(), -5),
            endDate: addDays(Date.now(), 25),
        }
    ];
    proposalCategories: ProposalCategory[];
    user: DomainUser;

    private routeSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService) { }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            let domainId = params['domainId'];
            console.log('DOMAIN ID', domainId);
            this.userService.getDomainUser(domainId)
                .subscribe(user => this.user = user);
            this.getProposalGroups(Observable.of(this.proposalStub))
                .subscribe(proposalCategories => this.proposalCategories = proposalCategories);
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    onAddProposal() {
        console.log('Add proposal');
    }

    private getProposalGroups(proposalsObs: Observable<Proposal[]>) {
        return proposalsObs.map(proposals => {
            let categories: ProposalCategory[] = [];
            proposals.forEach(proposal => {
                let category = categories.find(cat => cat.description === proposal.category);
                if (!category) {
                    categories.push(category = { description: proposal.category, proposals: [] });
                }
                category.proposals.push(proposal);
            });
            return categories;
        });
    }
}

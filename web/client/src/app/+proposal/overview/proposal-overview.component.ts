import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

// import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-proposal-overview',
    templateUrl: './proposal-overview.component.html',
    styleUrls: ['./proposal-overview.component.scss'],
})
export class ProposalOverviewComponent implements OnInit, OnDestroy {
    proposals = [{}, {}];
    user: any;

    private routeSubscription: Subscription;

    constructor(
        private route: ActivatedRoute) { }
        // private userService: UserService) { }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            let domainId = params['domainId'];
            console.log('DOMAIN ID', domainId);
            // this.user = this.userService.user(domainId);
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }
}

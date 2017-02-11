import { Component, OnInit } from '@angular/core';
import { addDays } from 'date-fns';

import { InfoServiceAgent, ContractRpcServiceAgent } from '../service-agents';
import { ProposalService } from '../services/proposal.service';
import { UserService } from '../services/user.service';
import { VoteService } from '../services/vote.service';
import { Web3Service } from '../services/web3.service';
import { Balance } from '../models/webapi/balance.model';
import { DomainUser } from '../models/domain-user.model';
import { Proposal } from '../models/proposal.model';
import { Vote } from '../models/vote.model';
import { Role } from '../models/role.enum';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {

    balance: Balance;
    showSpinner: boolean;

    constructor(
        private infoServiceAgent: InfoServiceAgent,
        private contractRpcServiceAgent: ContractRpcServiceAgent,
        private userService: UserService,
        private proposalService: ProposalService,
        private voteService: VoteService,
        private web3Service: Web3Service) { }

    ngOnInit() {
    }

    getBalance(refresh = false) {
        this.showSpinner = true;
        this.infoServiceAgent.getBalance()
            .subscribe(
            response => {
                this.balance = response;
                this.showSpinner = false;
            },
            err => {
                this.showSpinner = false;
            });
    }

    clientBalance: Balance;
    netId: string;
    network: string;
    getClientBalance() {
        this.clientBalance = new Balance();
        this.clientBalance.coinbase = this.web3.eth.coinbase;
        this.web3.eth.getBalance(this.web3.eth.coinbase, (error, balance) => {
            console.log('error', error, 'balance (bignumber)', balance);
            this.clientBalance.originalBalance = this.web3.fromWei(balance, 'ether');
        });
        this.web3.version.getNetwork((error, netId) => {
            console.log('error', error, 'netId', netId);
            this.netId = netId;
            switch (netId) {
                case "1":
                    this.network = 'This is mainnet';
                    break;
                case "2":
                    this.network = 'This is the deprecated Morden test network.';
                    break;
                case "3":
                    this.network = 'This is the ropsten test network.';
                    break;
                default:
                    this.network = 'This is an unknown network.';
            }
        });
    }

    contractCallResult: string;
    tryMetaCoinContractCall() {
        this.contractRpcServiceAgent.getContractInstance('MetaCoin')
            .subscribe(
            contractInstance => {
                // console.log('contract', response);
                contractInstance.getBalanceInEth.call(this.web3.eth.coinbase, { from: this.web3.eth.coinbase }, (error, response) => {
                    console.log('error', error, 'getBalanceInEth response', response);
                    this.contractCallResult = response;
                });
            });
    }

    domain = 'borough';
    roles = Role;
    role = Role.voter;

    hasRoleResponse: boolean;
    getHasRole() {
        this.userService.hasRole(this.domain, this.role)
            .subscribe((response) => {
                this.hasRoleResponse = response;
            }, (error) => {
                console.error('error', error);
            });
    }
    setRoleResponse: string;
    setHasRole(hasRole: boolean) {
        this.userService.setRole(this.domain, this.role, hasRole)
            .subscribe((response) => {
                this.setRoleResponse = response;
            }, (error) => {
                console.error('error', error);
            });
    }

    domainUser: DomainUser;
    getDomainUser() {
        this.userService.getDomainUser(this.domain)
            .subscribe((response) => {
                this.domainUser = response;
            }, (error) => {
                console.error('error', error);
            });
    }

    testjeResult: number;
    tryTestje() {
        this.userService.testje()
            .subscribe((response) => {
                this.testjeResult = response;
            }, (error) => {
                console.error('error', error);
            });
    }

    proposals: Proposal[];
    getProposals() {
        this.proposalService.getProposals(this.domain)
            .subscribe(response => {
                console.log('getProposals response', response);
                this.proposals = response;
            }, (error) => {
                console.error('error', error);
            });
    }
    //uint parentId, bytes32 title, bytes32 domain, bytes32 category, bytes32 phase,
    //string description, uint maxVoteScale, uint endDate, uint completed) returns (uint) {
    addProposal() {
        const proposal = new Proposal();
        proposal.iteration = 1;
        proposal.title = 'fake title';
        proposal.domain = this.domain;
        proposal.category = 'TODO category';
        proposal.phase = 'TODO phase';
        proposal.description = 'TODO description';
        proposal.endDate = addDays(Date.now(), 20);
        proposal.completed = 19;
        this.proposalService.addNewProposal(proposal)
            .subscribe(response => {
                proposal.id = response;
            }, (error) => {
                console.error('error', error);
            });
    }

    vote: Vote;
     getProposalVote(proposal) {
        this.voteService.getProposalVote(proposal.id)
            .subscribe(response => {
                this.vote = response;
            }, (error) => {
                console.error('error', error);
            });
    }

    setVoteResult: string;
    setVote(proposal: Proposal) {
        this.voteService.voreForProposal(proposal.id, 2, 'TODO comment')
            .subscribe(response => {
                this.setVoteResult = response;
            }, (error) => {
                console.error('error', error);
            });
    }

    get web3() {
        return this.web3Service.web3;
    }
}
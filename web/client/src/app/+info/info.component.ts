import { Component, OnInit } from '@angular/core';

import { InfoServiceAgent, ContractRpcServiceAgent } from '../service-agents';
import { UserService } from '../services/user.service';
import { Web3Service } from '../services/web3.service';
import { Balance } from '../models/webapi/balance.model';
import { DomainUser } from '../models/domain-user.model';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
})
export class InfoComponent implements OnInit {

    balance: Balance;
    showSpinner: boolean;

    constructor(
        private infoServiceAgent: InfoServiceAgent,
        private contractRpcServiceAgent: ContractRpcServiceAgent,
        private userService: UserService,
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


    hasRoleResponse: boolean;
    getHasRole() {
        this.userService.hasRole('insurance', 'admin')
            .subscribe((response) => {
                this.hasRoleResponse = response;
            });
    }
    setRoleResponse: string;
    setHasRole(hasRole: boolean) {
        this.userService.setRole('insurance', 'admin', hasRole)
            .subscribe((response) => {
                this.setRoleResponse = response;
            });
    }

    domainUser: DomainUser;
    getDomainUser() {
        this.userService.getDomainUser('insurance')
            .subscribe((response) => {
                this.domainUser = response;
            });
    }

    testjeResult: number;
    tryTestje() {
        this.userService.testje()
            .subscribe((response) => {
                this.testjeResult = response;
            });
    }

    get web3() {
        return this.web3Service.web3;
    }
}
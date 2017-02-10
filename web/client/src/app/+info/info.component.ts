import { Component, OnInit } from '@angular/core';

import { InfoServiceAgent, ContractRpcServiceAgent } from '../service-agents';
import { Web3Service } from '../services/web3.service';
import { Balance } from '../models/webapi';

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
        this.contractRpcServiceAgent.getContractMetaData('MetaCoin')
            .subscribe(
            response => {
                // console.log('contract', response);
                let metaCoinMetaData = response;
                let metaCoinContract = this.web3.eth.contract(metaCoinMetaData.abi);
                let contractInstance = metaCoinContract.at(metaCoinMetaData.networks['1'].address);
                contractInstance.getBalanceInEth.call(this.web3.eth.coinbase, { from: this.web3.eth.coinbase }, (error, response) => {
                    console.log('error', error, 'getBalanceInEth response', response);
                    this.contractCallResult = response;
                });
            }
            )
    }

    get web3() {
        return this.web3Service.web3;
    }
}
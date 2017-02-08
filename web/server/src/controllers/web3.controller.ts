// import { Request, Response } from "express";
import { Get, Route } from 'tsoa';
import * as Web3 from "web3";
// let Web3 = require('web3');

import { Balance } from '../models/balance.model';

@Route('web3')
export class Web3Controller {
    @Get('balance')
    public async getBalance(): Promise<Balance> {
        // console.log('Web3Controller.show', 'this', this)
        this.ensureWeb3();
        let balance = new Balance();
        balance.coinbase = this.web3.eth.coinbase;
        balance.originalBalance = this.web3.eth.getBalance(balance.coinbase).toNumber();
        return balance;
    }

    private ensureWeb3() {
        if (typeof this.web3 !== 'undefined') {
            this.web3 = new Web3(this.web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            // console.log(Web3);
            this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        }
        // throw new Error('error Hopla')
    }
    web3: any;
}
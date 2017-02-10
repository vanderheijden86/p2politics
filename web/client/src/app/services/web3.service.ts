import { Injectable } from '@angular/core';

declare let Web3: any;
declare let window: any;

@Injectable()
export class Web3Service {
    get web3() {
        if (!this._web3) {
            if (typeof window.web3 !== 'undefined') {
                // note: this is the MetaMask net (setting localhost in MetaMask does not seem to work)
                window.web3 = new Web3(window.web3.currentProvider);
            } else {
                // set the provider you want from Web3.providers
                // note: you have to set this explicitly in order to force connecting to the local node
                window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
            }
        }
        this._web3 = window.web3;
        return this._web3;
    }
    private _web3;
}

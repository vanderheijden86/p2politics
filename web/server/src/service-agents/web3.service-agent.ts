let metaCoinMetaData = require('../../../../build/contracts/MetaCoin.json');

import { web3ConfigInstance } from '../config/web3.config';
import * as Web3 from "web3";
import * as BigNumber from 'bignumber.js';

import { Balance } from '../models/balance.model';

export class Web3ServiceAgent {
    getBalance(): Balance {
        let balance = new Balance();
        balance.coinbase = this.web3.eth.coinbase;
        balance.originalBalance = this.web3.eth.getBalance(balance.coinbase).toNumber();
        return balance;
    }

    tryMetaCoin(): string {
        let metaCoinContract = this.web3.eth.contract(metaCoinMetaData.abi);
        // console.log('metaCoinContract', metaCoinContract);

        // instantiate by address
        // console.log('metaCoinMetaData.networks["1"].address', metaCoinMetaData.networks['1'].address);
        let contractInstance = metaCoinContract.at(metaCoinMetaData.networks['1'].address);
        // console.log('contractInstance', contractInstance);
        //let balanceAddress = '0x5fea3e33fd6d2ff27f9382be45b72e59b9df2497';

        let ad = '0x8Ae4F8fC3eCaf9E9394f037FD54405DBF77daCa2'; // address in MetaMask
        let to = '0xb8ab7ea5073c777a46701c3184fd540b9bd1ff36';

        let sendCoinResult = contractInstance.sendCoin.call(to, 1, { from: this.web3.defaultAccount });
        console.log('sendCoinResult', sendCoinResult);

        let result = contractInstance.getBalanceInEth.call(to, { from: ad });
        // let big = new BigNumber(result);

        console.log('result', result);
        console.log('result.toNumber', result.toNumber());
        return result.toNumber();
        // return 'tryMetaCoin stub';
    }

    get web3() {
        if (!this._web3) {
            // set the provider you want from Web3.providers
            this._web3 = new Web3(new Web3.providers.HttpProvider(web3ConfigInstance.providerUrl));
            // console.log('web3.version.api', this.web3.version.api, 'web3.version', this.web3.version);
            this._web3.defaultAccount = this._web3.eth.accounts[0];
            console.log('this._web3.defaultAccount', this._web3.defaultAccount)
        }
        return this._web3;
    }
    private _web3: any;
}

export const web3ServiceAgentInstance = new Web3ServiceAgent();

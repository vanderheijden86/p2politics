import { Get, Route } from 'tsoa';

import { web3ServiceAgentInstance } from '../service-agents/web3.service-agent';
import { Balance } from '../models/balance.model';

@Route('web3')
export class Web3Controller {
    @Get('balance')
    public async getBalance(): Promise<Balance> {
        return web3ServiceAgentInstance.getBalance();
    }

    @Get('metacoin')
    public async getMetaCoin(): Promise<string> {
        return web3ServiceAgentInstance.tryMetaCoin();
    }
}
class Web3Config {
    port = 8545;
    get providerUrl() {
        return `http://localhost:${this.port}`;
    }
}

export const web3ConfigInstance = new Web3Config();

